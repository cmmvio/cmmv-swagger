import { Module } from '@cmmv/core';

import { SwaggerController } from '../controllers/swagger.controller';
import { SwaggerTranspiler } from '../transpilers/swagger.transpiler';

export const SwaggerModule = new Module('swagger', {
    controllers: [SwaggerController],
    transpilers: [SwaggerTranspiler]
});