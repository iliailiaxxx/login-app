import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import * as bcrypt from "bcrypt"
import { CreateUserDTO } from 'src/modules/user/dto';
import { Op, where } from 'sequelize';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService implements OnModuleInit {
    constructor(@InjectModel(User) private readonly user: typeof User, private readonly configService: ConfigService) { }

    async hashPassword(password) {
        return bcrypt.hash(password, 10)
    }

    async findUserByUsername(username: string) {
        return this.user.findOne({ where: { username } })
    }
    async findUserBySupervisor(username: string) {
        return this.user.findOne({ where: { supervisor:username } })
    }

    async getUserRole(username: string) {
        const user = await this.user.findOne({ where: { username } })
        return user.role
    }

    async changeUserToBoss(dto: CreateUserDTO) {
        if (dto.supervisor) {
            const supervisor = await this.user.findOne({ where: { username: { [Op.eq]: dto.supervisor } } })
            if (!supervisor) throw new BadRequestException("there is no such supervisor")
            if (supervisor) {
                supervisor.set({
                    role: "boss"
                })
                await supervisor.save()
            }
        }
    }



    async createAdmin() {
        const admin = await this.findUserByUsername("admin")
        if (!admin) {
            const adminPassword = await this.hashPassword(this.configService.get("admin_password"))
            await this.user.create({
                role: "admin",
                username: "admin",
                password: adminPassword,
                supervisor: null,
            })
        }
    }

    async createUser(dto: CreateUserDTO): Promise<CreateUserDTO> {
        dto.password = await this.hashPassword(dto.password)

        await this.user.create({
            role: "user",
            username: dto.username,
            password: dto.password,
            supervisor: dto.supervisor,
        })
        return dto
    }

    async getUsers(req) {
        const { username, role } = req.user

        if (role === "admin") {
            return await this.user.findAll()
        }
        if (role === "boss") {
            return await this.user.findAll({ where: { [Op.or]: [{ username }, { supervisor:username }] } })
        }
        if (role === "user") {
            return await this.user.findOne({ where: { username }})
        }

    }

    async changeUserSupervisor(req, dto) {
        const { username, role } = req.user
        
        const userToChange = await this.findUserByUsername(dto.username)
        if (!userToChange) throw new BadRequestException("there is no such user")
        if (userToChange.supervisor !== username) throw new BadRequestException("you are not allowed to change user supervisor")

        const newSupervisor = await this.findUserByUsername(dto.supervisor)
        if (!newSupervisor) throw new BadRequestException("there is no such supervisor")

        userToChange.set({
            supervisor: newSupervisor.username
        })
        await userToChange.save()

        this.checkIfStilSupervisor(username)

        return userToChange
    }
    async checkIfStilSupervisor(username) {
        const subordinate = await this.findUserBySupervisor(username)
        if (!subordinate) {
            const userToChange = await this.findUserByUsername(username)
            userToChange.set({
                role: "user"
            })
            await userToChange.save()
        }
    }
    onModuleInit() {
        this.createAdmin()

    }
}
