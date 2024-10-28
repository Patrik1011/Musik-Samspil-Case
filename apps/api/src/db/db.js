import { mongoose } from 'mongoose';

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;

  console.log('Connecting to database:', uri);

  try {
    return mongoose.connect(uri);
  } catch (error) {
    console.error('Database connection error:', error);

    throw error;
  }
}
