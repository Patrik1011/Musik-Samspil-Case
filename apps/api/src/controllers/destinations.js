import mongoose from 'mongoose';

import multer from 'multer';

import Destination from '../schemas/Destination.js';

import { handleErrorResponse } from '../utils/errorHandler.js';

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only PNG files are allowed'), false);
    }
  }
});

export async function getHomeRoute(req, res) {
  try {
    const message = await Destination.findOne({});

    res.json({
      message: message
        ? message.name
        : 'Welcome to the Travel Destinations Express API!'
    });
  } catch (error) {
    handleErrorResponse(res, 500, 'Error in home route', error);
  }
}

export async function getAllDestinations(req, res) {
  try {
    const destinations = await Destination.find({});

    if (destinations.length === 0) {
      return handleErrorResponse(res, 404, 'No destinations found');
    }

    const destinationsWithImageUrls = destinations.map((dest) => {
      const destObj = dest.toObject();

      if (typeof destObj.image_url === 'string') {
        return destObj;
      }

      if (destObj.image_url?.data && destObj.image_url.contentType) {
        destObj.image_url = `data:${destObj.image_url.contentType};base64,${destObj.image_url.data.toString('base64')}`;
      } else {
        destObj.image_url = null;
      }

      return destObj;
    });

    res.status(200).json(destinationsWithImageUrls);
  } catch (error) {
    handleErrorResponse(res, 500, 'Error fetching destinations', error);
  }
}

export async function getDestinationById(req, res) {
  try {
    const destinationID = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(destinationID)) {
      return handleErrorResponse(res, 400, 'Invalid destination ID');
    }

    const destination = await Destination.findById(destinationID).lean();

    if (!destination) {
      return handleErrorResponse(res, 404, 'Destination not found');
    }

    res.status(200).json(destination);
  } catch (error) {
    handleErrorResponse(res, 500, 'Error fetching destination', error);
  }
}

export async function createDestination(req, res) {
  try {
    await upload.single('image_url')(req, res, async (err) => {
      if (err) {
        return handleErrorResponse(res, 400, 'Error uploading file', err);
      }

      const destination = new Destination({
        title: req.body.title,
        description: req.body.description,
        country: req.body.country,
        image_url: req.file
          ? {
              data: req.file.buffer,
              contentType: req.file.mimetype
            }
          : undefined
      });

      const result = await destination.save();

      res.status(201).json(result);
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return handleErrorResponse(res, 400, 'Validation errors', error);
    }

    handleErrorResponse(res, 500, 'Error creating destination', error);
  }
}

export async function updateDestination(req, res) {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return handleErrorResponse(res, 400, 'Error uploading file', err);
    }

    const { id } = req.params;

    const { title, description, country } = req.body;

    const image = req.file;

    try {
      const updateData = {
        title,
        description,
        country
      };

      if (image) {
        updateData.image_url = {
          data: image.buffer,
          contentType: image.mimetype
        };
      }

      const updatedDestination = await Destination.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).lean();

      if (!updatedDestination) {
        return handleErrorResponse(res, 404, 'Destination not found');
      }

      res.status(200).json(updatedDestination);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return handleErrorResponse(res, 400, 'Validation errors', error);
      }

      handleErrorResponse(res, 500, 'Error updating destination', error);
    }
  });
}

export async function deleteDestination(req, res) {
  try {
    const destinationID = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(destinationID)) {
      return handleErrorResponse(res, 400, 'Invalid destination ID');
    }

    const result = await Destination.deleteOne({ _id: destinationID });

    if (result.deletedCount === 0) {
      return handleErrorResponse(res, 404, 'Destination not found');
    }

    res.status(204).send();
  } catch (error) {
    handleErrorResponse(res, 500, 'Error deleting destination', error);
  }
}
