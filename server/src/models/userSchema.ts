import mongoose, { Document, Schema } from "mongoose";

// Define the User interface
interface IUser extends Document {
  name: string;
  email: string;
  dob?: Date | null;
  otp?: number | null;
  otpExpiration?: Date | null;
  isVerified: boolean;
}

// Define the schema for the User
const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  dob: {
    type: Date,
    default: null,
  },
  otp: {
    type: Number,
    default: null,
  },
  otpExpiration: {
    type: Date,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

// Export the User model
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
