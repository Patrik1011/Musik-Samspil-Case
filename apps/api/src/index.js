import cors from 'cors';

import express from 'express';

import {
  getHomeRoute,
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
} from './controllers/destinations.js';

import {
  getAllUsers,
  getUserByEmail,
  updateUser,
  deleteUser
} from './controllers/users.js';

import {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getTripsByUser,
  addDestinationToTrip,
  removeDestinationFromTrip
} from './controllers/trips.js';

import { config } from './db/config.js';

import { connectToDatabase } from './db/db.js';

import { validateObjectId } from './middleware/validateObjectId.js';

import { login, signup, verifyToken } from './controllers/auth.js';

const app = express();

const PORT = process.env.PORT || 3000;

startServer();

setupMiddleware();

setupRoutes();

export default app;

function setupMiddleware() {
  app.use(
    cors({
      origin: [
        'https://travel-destinations-mu.vercel.app',
        'http://localhost:8080',
        'http://127.0.0.1:8080'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  app.use(express.json({ limit: '50mb' }));

  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.disable('x-powered-by');
}

async function startServer() {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(
        `Server running in ${
          config.isProduction ? 'production' : 'development'
        } mode on port ${PORT}`
      );
    });
  } catch (error) {
    console.error('Failed to start the server:', error);

    process.exit(1);
  }
}

function setupRoutes() {
  app.options('*', cors());

  // DESTINATION ROUTES
  app.get('/api/v1', verifyToken, (req, res) => getHomeRoute(req, res));

  app.get('/api/v1/destinations', verifyToken, (req, res) =>
    getAllDestinations(req, res)
  );

  app.get('/api/v1/destinations/:id', verifyToken, (req, res) =>
    getDestinationById(req, res)
  );

  app.post('/api/v1/destinations', verifyToken, (req, res) =>
    createDestination(req, res)
  );

  app.put('/api/v1/destinations/:id', verifyToken, (req, res) =>
    updateDestination(req, res)
  );

  app.delete('/api/v1/destinations/:id', verifyToken, (req, res) =>
    deleteDestination(req, res)
  );

  // USER ROUTES
  app.get('/api/v1/users', verifyToken, (req, res) => getAllUsers(req, res));

  app.get('/api/v1/users/:email', verifyToken, (req, res) =>
    getUserByEmail(req, res)
  );

  app.put('/api/v1/users/:email', verifyToken, (req, res) =>
    updateUser(req, res)
  );

  app.delete('/api/v1/users/:email', verifyToken, (req, res) =>
    deleteUser(req, res)
  );

  // AUTHENTICATION ROUTES
  app.post('/api/v1/auth/login', login);

  app.post('/api/v1/auth/signup', signup);

  // TRIP ROUTES
  app.get('/api/v1/trips', verifyToken, (req, res) => getAllTrips(req, res));

  app.get(
    '/api/v1/trips/:id',
    verifyToken,
    validateObjectId('id'),
    getTripById
  );

  app.post('/api/v1/trips', verifyToken, (req, res) => createTrip(req, res));

  app.put('/api/v1/trips/:id', verifyToken, validateObjectId('id'), updateTrip);

  app.delete(
    '/api/v1/trips/:id',
    verifyToken,
    validateObjectId('id'),
    deleteTrip
  );

  app.get(
    '/api/v1/trips/user/:id',
    verifyToken,
    validateObjectId('id'),
    getTripsByUser
  );

  app.post('/api/v1/trips/:id/destinations', verifyToken, (req, res) =>
    addDestinationToTrip(req, res)
  );

  app.delete(
    '/api/v1/trips/:id/destinations/:destinationId',
    verifyToken,
    (req, res) => removeDestinationFromTrip(req, res)
  );
}
