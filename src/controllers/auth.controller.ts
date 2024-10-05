// Generated automatically by CMMV
    
import { Config } from "@cmmv/core";
import { Auth } from "@cmmv/auth";

import { 
    Controller, Post, Body, Req, 
    Res, Get, Session
} from "@cmmv/http";

import { AuthService } from '../services/auth.service';

import { 
    LoginRequest, LoginResponse, 
    RegisterRequest, RegisterResponse 
} from '../protos/auth';

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("user")
    @Auth()
    async user(@Req() req) {
        return req.user;
    }

    

    
}