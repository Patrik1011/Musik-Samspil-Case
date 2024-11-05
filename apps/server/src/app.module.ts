import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './services/user.service';
import {AuthModule} from "./auth/auth.module";
import {PrismaModule} from "./prisma/prisma.module";


@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, UserService],
})
export class AppModule {}