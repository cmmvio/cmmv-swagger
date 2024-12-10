<p align="center">
  <a href="https://cmmv.io/" target="blank"><img src="https://raw.githubusercontent.com/andrehrferreira/docs.cmmv.io/main/public/assets/logo_CMMV2_icon.png" width="300" alt="CMMV Logo" /></a>
</p>
<p align="center">Contract-Model-Model-View (CMMV) <br/> Building scalable and modular applications using contracts.</p>
<p align="center">
    <a href="https://www.npmjs.com/package/@cmmv/swagger"><img src="https://img.shields.io/npm/v/@cmmv/swagger.svg" alt="NPM Version" /></a>
    <a href="https://github.com/andrehrferreira/cmmv-swagger/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@cmmv/swagger.svg" alt="Package License" /></a>
</p>

<p align="center">
  <a href="https://cmmv.io">Documentation</a> &bull;
  <a href="https://github.com/andrehrferreira/cmmv-swagger/issues">Report Issue</a>
</p>

## Description

The ``@cmmv/swagger`` module provides an automated solution for generating Swagger API documentation based on the contracts defined in the CMMV application. The ``SwaggerTranspiler`` class processes the contracts, extracting information such as controller names, fields, and request/response types. It generates a complete OpenAPI 3.0 specification, including routes for CRUD operations, data schemas, and authentication routes if the ``@cmmv/auth`` module is present. The module integrates security schemes, adds necessary paths for login, registration, and user management, and handles the inclusion of common request/response formats. The generated output is written to a ``swagger.json`` file, which can be used with Swagger UI or similar tools to provide interactive API documentation.

## Installation

CMMV is available as a collection of npm packages. To install the core package, use npm:

```bash
$ pnpm add @cmmv/swagger
```

## Quick Start

Below is a simple example of how to create a new CMMV application:

```typescript
import { Application } from "@cmmv/core";
import { AuthModule } from "@cmmv/auth";
import { SwaggerModule } from "@cmmv/swagger";

import { 
  DefaultAdapter, DefaultHTTPModule 
} from "@cmmv/http";

Application.create({
    httpAdapter: DefaultAdapter,
    modules: [
        DefaultHTTPModule, 
        AuthModule,
        SwaggerModule
    ],
    contracts: [...]
})
```