import { IsOptional, IsString, NotContains } from "class-validator";

export class ChangeUserSupervisorDTO{
    @IsString()
    username: string

    @IsString()
    @NotContains("admin")
    supervisor: string
} 
