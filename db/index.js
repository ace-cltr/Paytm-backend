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
  firstName: { type: String, required: true, minLength: 2, trim: true },
  lastName: { type: String, minLength: 2, trim: true },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: { type: String, required: true, minLength: 6 },
});

/**
 * Account Schema
 * @module models/accountSchema
 * @requires mongoose
 */

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, required: true },
});

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);

export { User, Account };
