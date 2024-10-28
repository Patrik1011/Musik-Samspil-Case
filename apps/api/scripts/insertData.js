import { connectToDatabase } from '../src/db/db.js';

import Trip from '../src/schemas/Trip.js';

import {
  generateDummyTrips
} from './dummyData.js';

async function clearCollection(model) {
  await model.deleteMany({});
}

async function insertDummyData() {
  try {
    await connectToDatabase();

    await clearCollection(Trip);

    await generateDummyTrips();
  } catch (error) {
    console.error('Error in dummy data process:', error);
  } finally {
    process.exit(0);
  }
}

insertDummyData();
