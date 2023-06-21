import {IsOptional, IsString, NotContains } from "class-validator";

export class CreateUserDTO{
    @IsString()
    username: string
    
    @IsString()
    password: string
    
    @IsOptional() 
    @IsString()
    @NotContains("admin")
    supervisor: string
} 


