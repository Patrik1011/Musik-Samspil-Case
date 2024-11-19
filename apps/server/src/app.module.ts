import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./modules/users/users.module";
import { EnsembleModule } from "./modules/ensemble/ensemble.module";

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, EnsembleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
