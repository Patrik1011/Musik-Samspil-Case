import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { DatabaseService } from "./db/database.service";
import { resolve } from "node:path";
import { EnsembleModule } from "./modules/ensemble/ensemble.module";
import { EnsembleMembershipModule } from "./modules/ensemble-membership/ensemble-membership.module";
import { PostModule } from "./modules/post/post.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, "../.env"),
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    EnsembleModule,
    EnsembleMembershipModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
