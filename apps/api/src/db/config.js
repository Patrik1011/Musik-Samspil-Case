import dotenv from 'dotenv';

dotenv.config();

export const config = {
  isProduction: process.env.NODE_ENV === 'production',
  mongodbAtlasUri: process.env.MONGODB_URI,
  mongodbLocalUri: process.env.MONGODB_LOCAL_URI
};
