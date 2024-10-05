import * as path from 'node:path';
import * as fs from 'node:fs';

import { 
    Controller, Get, Request,
    Response
} from '@cmmv/http';

import { Config } from '@cmmv/core';

@Controller('docs')
export class SwaggerController {
    @Get('/swagger.json')
    async getSwaggerSpec(@Request() req, @Response() res): Promise<void> {
        const swaggerPath = path.resolve(__dirname, '../../swagger.json');
        const swaggerFile = fs.readFileSync(swaggerPath, 'utf-8');
        res.type('application/json').send(swaggerFile);
    }

    @Get()
    async getSwaggerUI(@Request() req, @Response() res): Promise<void> {
        const config = Config.get("swagger.docs", {});
        const title = config.info?.title || "API Documentation";
        
        const swaggerUIHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${title}</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui.css" />
            </head>
            <body>
                <div id="swagger-ui"></div>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui-bundle.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.3/swagger-ui-standalone-preset.js"></script>
                <script>
                    const ui = SwaggerUIBundle({
                        url: '/docs/swagger.json', // URL where swagger.json is served
                        dom_id: '#swagger-ui',
                        presets: [
                            SwaggerUIBundle.presets.apis,
                            SwaggerUIBundle.SwaggerUIStandalonePreset
                        ],
                    });
                </script>
            </body>
            </html>
        `;

        res.type('text/html').send(swaggerUIHtml);
    }
}
