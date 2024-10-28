import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      trim: true
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      trim: true
    },
    destinations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
        required: true
      }
    ],
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return value > this.start_date;
        },
        message: 'End date must be after start date.'
      }
    }
  },
  { versionKey: false }
);

tripSchema.index({ user_id: 1 });

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
