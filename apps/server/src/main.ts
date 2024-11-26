import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DatabaseService } from "./db/database.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.get(DatabaseService).onModuleInit();

  app.enableCors({
    origin: "http://localhost:5173",
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((error) => {
  console.error("Error starting application:", error);
  process.exit(1);
});
