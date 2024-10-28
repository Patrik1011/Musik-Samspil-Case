import mongoose from 'mongoose';

import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: [true, 'User with this username already exists'],
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true['User with this email already exists'],
      match: [
        /* eslint-disable-next-line sonarjs/single-char-in-character-classes */
        /^[\w.%+-]+@[\w-]+\.[\w]{2,}$/i,
        'Please provide a valid email address'
      ],
      lowercase: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { versionKey: false }
);

// Hashing password before saving it in the database
// eslint-disable-next-line prefer-arrow-callback
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const User = mongoose.model('User', userSchema);

export default User;
