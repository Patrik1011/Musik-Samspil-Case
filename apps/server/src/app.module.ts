import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { DatabaseService } from "./db/database.service";
import { resolve } from "node:path";
import { EnsembleModule } from "./modules/ensemble/ensemble.module";
import { MatchmakingModule } from "./modules/matchmaking/matchmaking.module";
import { EnsembleMembershipModule } from "./modules/ensemble-membership/ensemble-membership.module";
import { PostModule } from "./modules/post/post.module";
import { ApplicationModule } from "./modules/application/application.module";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve(__dirname, "../.env"),
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || ""),
    AuthModule,
    UsersModule,
    EnsembleModule,
    EnsembleMembershipModule,
    ApplicationModule,
    PostModule,
    MatchmakingModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
  exports: [DatabaseService],
})
export class AppModule {}
