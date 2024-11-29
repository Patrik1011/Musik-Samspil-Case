import { Schema, model } from "mongoose";

export const UserSchema = new Schema(
  {
    first_name: String,
    last_name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: String,
    bio: String,
  },
  { collection: "User" },
);

export const User = model("User", UserSchema);
