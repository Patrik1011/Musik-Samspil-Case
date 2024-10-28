import Trip from '../schemas/Trip.js';

import multer from 'multer';

import { getUserByEmail } from './users.js';

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }
});

function handleError(error, res, message) {
  console.error(`${message}:`, error);

  res.status(500).json({ error: `Internal Server Error. ${error}` });
}

export const getAllTrips = async (req, res) => {
  try {
    console.log(req.user.isAdmin, req.user.user);

    let trips = [];

    if (req.user.isAdmin === true) {
      trips = await Trip.find({}).lean();
    } else {
      const id = req.user.user;

      trips = await Trip.find({ user_id: id }).lean();
    }

    if (trips.length === 0) {
      return res.status(404).json({ message: 'No trips found' });
    }

    res.status(200).json(trips);
  } catch (error) {
    handleError(error, res, 'Error fetching trips');
  }
};

export const getTripById = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findById(id).populate('destinations').lean();

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.status(200).json(trip);
  } catch (error) {
    handleError(error, res, 'Error fetching trip');
  }
};

export const createTrip = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return handleError(err, res, 'Error uploading file');
    }

    try {
      const user = await getUserByEmail(req.body.email);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { title, description, start_date, end_date } = req.body;

      if (!start_date || !end_date || !title || !description) {
        return res.status(400).json({
          error:
            'All fields are required (Start Date, End Date, Title, Description)'
        });
      }

      const newTrip = new Trip({
        user_id: user._id,
        title,
        description,
        start_date,
        end_date
      });

      const result = await newTrip.save();

      console.log('Trip created:', result);

      res.status(201).json(result);
    } catch (error) {
      handleError(error, res, 'Error creating trip');
    }
  });
};

export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTrip = await Trip.findByIdAndDelete(id);

    if (!deletedTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    handleError(error, res, 'Error deleting trip');
  }
};

export const updateTrip = async (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return handleError(err, res, 'Error uploading file');
    }

    try {
      const { id } = req.params;

      const { title, description, start_date, end_date } = req.body;

      if (!title || !start_date || !end_date || !description) {
        return res.status(400).json({
          error:
            'All fields are required (Destinations, Start Date, End Date, Title, Description)'
        });
      }

      const updatedTrip = await Trip.findByIdAndUpdate(id, req.body, {
        new: true,
        lean: true
      });

      if (!updatedTrip) {
        return res.status(404).json({ error: 'Trip not found' });
      }

      res
        .status(200)
        .json({ message: 'Trip updated successfully', trip: updatedTrip });
    } catch (error) {
      handleError(error, res, 'Error updating trip');
    }
  });
};

export const getTripsByUser = async (req, res) => {
  try {
    const { id } = req.params;

    const trips = await Trip.find({ user_id: id }).lean();

    if (!trips.length) {
      return res.status(404).json({ message: 'No trips found' });
    }

    res.status(200).json(trips);
  } catch (error) {
    handleError(error, res, 'Error fetching trips');
  }
};

export const addDestinationToTrip = async (req, res) => {
  try {
    const { id: tripId } = req.params;

    const { destinationId } = req.body;

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $addToSet: { destinations: destinationId } },
      { new: true }
    ).populate('destinations');

    if (!updatedTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.status(200).json(updatedTrip);
  } catch (error) {
    handleError(error, res, 'Error adding destination to trip');
  }
};

export const removeDestinationFromTrip = async (req, res) => {
  try {
    const { id: tripId, destinationId } = req.params;

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $pull: { destinations: destinationId } },
      { new: true }
    ).populate('destinations');

    if (!updatedTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.status(200).json(updatedTrip);
  } catch (error) {
    handleError(error, res, 'Error removing destination from trip');
  }
};
