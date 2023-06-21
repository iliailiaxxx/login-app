import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) { }
    
    async generateJwtToken(user) {
        const payload = { user }
        return this.jwtService.sign(payload, {
            secret: this.configService.get("secret_jwt"),
            expiresIn:this.configService.get("expire_jwt")
        })
    }
} 
