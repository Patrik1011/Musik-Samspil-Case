import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { DatabaseService } from "./db/database.service";
import { resolve } from "node:path";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, "../.env"),
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
