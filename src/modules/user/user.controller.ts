import { Request, Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from 'src/guards/roleGuards';
import { ChangeUserSupervisorDTO } from './dto/changeSupervisorDto';


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(RolesGuard)
    @Get()
    test(@Request() req:Request) {
        return this.userService.getUsers(req)
    }

    @UseGuards(RolesGuard)
    @Post("change-supervisor")
    changeUserSupervisor(@Request() req: Request, @Body() dto: ChangeUserSupervisorDTO) {
        return this.userService.changeUserSupervisor(req, dto)
    }
}
