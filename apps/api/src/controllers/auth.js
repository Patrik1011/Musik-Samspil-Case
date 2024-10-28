import jwt from 'jsonwebtoken';

import { handleErrorResponse } from '../utils/errorHandler.js';

import User from '../schemas/User.js';

import bcrypt from 'bcrypt';

export async function signup(req, res) {
  try {
    const existingUser = await User.findOne({
      email: req.body.email.toLowerCase()
    });

    if (existingUser) {
      return handleErrorResponse(
        res,
        400,
        'User with this email already exists',
        {
          email: 'Email already exists'
        }
      );
    }

    const newUser = await User.create(req.body);

    const token = jwt.sign(
      { user: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin
      },
      token
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return handleErrorResponse(
        res,
        400,
        'There was an error with your submittion',
        error
      );
    }

    handleErrorResponse(res, 500, 'Error creating user', error);
  }
}

// User login
export async function login(req, res) {
  const { email, password } = req.body;

  console.log('we get in here');

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return handleErrorResponse(res, 400, 'No user found with this email', {
        email: 'No user found with this email'
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return handleErrorResponse(res, 400, 'Incorrect password', {
        // eslint-disable-next-line sonarjs/no-hardcoded-credentials
        password: 'Incorrect password'
      });
    }

    // Generate a JWT for the authenticated user
    const token = jwt.sign(
      { user: user._id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expiration set to 1 hour
    );

    res.status(200).json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      },
      token
    });
  } catch (error) {
    handleErrorResponse(res, 500, 'Login failed', error);
  }
}

// Middleware to verify JWT token
export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return handleErrorResponse(res, 401, 'Authentication required.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return handleErrorResponse(res, 403, 'Invalid token.', err);
  }
};

export const verifyAdmin = async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return handleErrorResponse(res, 403, 'Access denied. Admins only.');
  }

  next();
};
