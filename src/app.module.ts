import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './modules/user/user.module';
import { User } from './models/user.model';
import { AuthModule } from './modules/auth/auth.module';
import { TokenModule } from './modules/token/token.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load:[]
  }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule,UserModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: "mysql",
        host: configService.get("db_host"),
        port: configService.get("db_port"),
        username: configService.get("db_user"),
        password: configService.get("db_password"),
        database: configService.get("db_name"),
        synchronize: true,
        autoLoadModels: true,
        models:[User]
      })
    }),
    UserModule,
    AuthModule,
    TokenModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
