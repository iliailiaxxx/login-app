import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/modules/user/dto';
import { UserLoginDTO } from './dto';
import { AuthUserResponseDTO } from './dto/response';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() dto: CreateUserDTO): Promise<CreateUserDTO> {
        return this.authService.registerUsers(dto)
    }
    @Post('login')
    login(@Body() dto: UserLoginDTO): Promise<AuthUserResponseDTO>{
        return this.authService.loginUser(dto)
    }

}
