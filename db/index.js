import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI);

/**
 * User Schema
 * @module models/userSchema
 * @requires mongoose
 */

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minLength: 2 },
  lastName: { type: String, minLength: 2 },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
});

const User = mongoose.model("User", userSchema);

export { User };
