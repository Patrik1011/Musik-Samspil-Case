import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url: process.env.MONGO_URI,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  synchronize: true, // Set to false in production
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
};