import { Application } from "@cmmv/core";
import { DefaultAdapter, DefaultHTTPModule } from "@cmmv/http";
import { ProtobufModule } from "@cmmv/protobuf";
import { AuthModule } from "@cmmv/auth";
import { SwaggerModule } from "./main";

Application.create({
    httpAdapter: DefaultAdapter,
    wsAdapter: null,
    modules: [
        DefaultHTTPModule,
        ProtobufModule,
        AuthModule,
        SwaggerModule
    ],
})
