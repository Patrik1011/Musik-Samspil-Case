import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 3
    },
    description: {
      type: String,
      minLength: 3,
      required: true
    },
    image_url: {
      data: Buffer,
      contentType: String
    },
    country: {
      type: String,
      required: true
    }
  },
  { versionKey: false }
);

const Destination = mongoose.model('Destination', destinationSchema);

export default Destination;
