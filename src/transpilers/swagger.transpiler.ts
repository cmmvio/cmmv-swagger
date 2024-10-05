import * as fs from "node:fs";
import * as path from "node:path";

import { 
    Config, ITranspile, Logger, 
    Module, Scope
} from "@cmmv/core";

export class SwaggerTranspiler implements ITranspile {
    private logger: Logger = new Logger('SwaggerTranspiler');

    run(): void {
        const contracts = Scope.getArray<any>('__contracts');
        const config = Config.get("swagger.docs", {});
        const hasAuth = Module.hasModule('auth');

        let doc: any = {
            openapi: "3.0.0",
            info: {
                title: config.info?.title || "API Documentation",
                description: config.info?.description || "Auto-generated Swagger Documentation",
                version: config.info?.version || "1.0.0"
            },
            servers: [{
                url: config?.host || "http://localhost:3000"
            }],
            paths: {},
            components: {
                schemas: {},
                securitySchemes: hasAuth
                    ? {
                        BearerAuth: {
                            type: "http",
                            scheme: "bearer",
                            bearerFormat: "JWT"
                        }
                    }
                    : {}
            },
            security: hasAuth
                ? [{ BearerAuth: [] }]
                : []
        };

        if(hasAuth)
            doc = this.includeAuthRoutes(doc);
        
        contracts?.forEach((contract: any) => {
            const controllerName = contract.controllerName.toLowerCase();

            doc.paths[`/${controllerName}`] = {
                get: {
                    tags: [controllerName],
                    summary: `Retrieve all ${controllerName}`,
                    responses: {
                        200: {
                            description: `Successful retrieval of ${controllerName}`,
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: `#/components/schemas/${controllerName}`
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                post: {
                    tags: [controllerName],
                    summary: `Add a new ${controllerName}`,
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: `#/components/schemas/${controllerName}`
                                }
                            },
                            "application/x-www-form-urlencoded": {
                                schema: {
                                    $ref: `#/components/schemas/${controllerName}`
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: `${controllerName} created`,
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: `#/components/schemas/${controllerName}`
                                    }
                                }
                            }
                        }
                    }
                }
            };

            doc.paths[`/${controllerName}/{id}`] = {
                get: {
                    tags: [controllerName],
                    summary: `Get ${controllerName} by ID`,
                    parameters: [{
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string"
                        },
                        description: `ID of the ${controllerName} to retrieve`
                    }],
                    responses: {
                        200: {
                            description: `Successfully retrieved ${controllerName}`,
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: `#/components/schemas/${controllerName}`
                                    }
                                }
                            }
                        }
                    }
                },
                put: {
                    tags: [controllerName],
                    summary: `Update ${controllerName} by ID`,
                    parameters: [{
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string"
                        },
                        description: `ID of the ${controllerName} to update`
                    }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: `#/components/schemas/${controllerName}`
                                }
                            },
                            "application/x-www-form-urlencoded": {
                                schema: {
                                    $ref: `#/components/schemas/${controllerName}`
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: `${controllerName} updated`,
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: `#/components/schemas/${controllerName}`
                                    }
                                }
                            }
                        }
                    }
                },
                delete: {
                    tags: [controllerName],
                    summary: `Delete ${controllerName} by ID`,
                    parameters: [{
                        name: "id",
                        in: "path",
                        required: true,
                        schema: {
                            type: "string"
                        },
                        description: `ID of the ${controllerName} to delete`
                    }],
                    responses: {
                        200: {
                            description: `${controllerName} deleted`,
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            success: { type: "boolean" },
                                            affected: { type: "integer" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };

            const properties: any = {};
            contract.fields?.forEach((field: any) => {
                properties[field.propertyKey] = {
                    type: this.mapToSwaggerType(field.protoType)
                };
            });

            doc.components.schemas[controllerName] = {
                type: "object",
                properties
            };
        });       

        const outputFile = path.resolve('./swagger.json');
        fs.writeFileSync(outputFile, JSON.stringify(doc, null, 4), 'utf8');
    }

    private includeAuthRoutes(doc){
        doc.paths["/auth/login"] = {
            post: {
                tags: ["auth"],
                summary: "Login to the application",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/LoginRequest"
                            }
                        }
                    }
                },
                responses: {
                    200: {
                        description: "Successful login",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/LoginResponse"
                                }
                            }
                        }
                    }
                }
            }
        };

        doc.paths["/auth/register"] = {
            post: {
                tags: ["auth"],
                summary: "Register a new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/RegisterRequest"
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: "Successful registration",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/RegisterResponse"
                                }
                            }
                        }
                    }
                }
            }
        };

        doc.paths["/auth/user"] = {
            get: {
                tags: ["auth"],
                summary: "Get the current authenticated user",
                security: [{ BearerAuth: [] }],
                responses: {
                    200: {
                        description: "Successfully retrieved the user",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/User"
                                }
                            }
                        }
                    }
                }
            }
        };

        // Add the LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, and User schemas
        doc.components.schemas["LoginRequest"] = {
            type: "object",
            properties: {
                username: { type: "string" },
                password: { type: "string" }
            }
        };

        doc.components.schemas["LoginResponse"] = {
            type: "object",
            properties: {
                success: { type: "boolean" },
                token: { type: "string" },
                message: { type: "string" }
            }
        };

        doc.components.schemas["RegisterRequest"] = {
            type: "object",
            properties: {
                username: { type: "string" },
                email: { type: "string" },
                password: { type: "string" }
            }
        };

        doc.components.schemas["RegisterResponse"] = {
            type: "object",
            properties: {
                success: { type: "boolean" },
                message: { type: "string" }
            }
        };

        doc.components.schemas["User"] = {
            type: "object",
            properties: {
                id: { type: "string" },
                username: { type: "string" },
                email: { type: "string" }
            }
        };

        return doc;
    }

    private mapToSwaggerType(protoType: string): string {
        const typeMapping: { [key: string]: string } = {
            string: 'string',
            boolean: 'boolean',
            bool: 'boolean',
            int: 'integer',
            int32: 'integer',
            int64: 'integer',
            float: 'number',
            double: 'number',
            bytes: 'string',
            date: 'string',
            timestamp: 'string',
            json: 'object',
            jsonb: 'object',
            uuid: 'string'
        };

        return typeMapping[protoType] || 'string';
    }
}
