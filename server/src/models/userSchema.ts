import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

// Define the User interface
export interface IUser extends Document {
  name: string;
  email: string;
  dob?: Date | null;
  otp?: number | null;
  otpExpiration?: Date | null;
  isVerified: boolean;
  password: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
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
    match: [
      /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/,
      "Please provide a valid email",
    ],
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
  password: {
    type: String,
    required: true,
    trim: true,
    match: [
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least 8 characters, including uppercase, lowercase, a number, and a special character.",
    ],
  },
});

// Middleware to hash the password before saving
UserSchema.pre("save", async function (next) {
  const user = this as IUser;

  // Only hash the password if it has been modified or is new
  if (!user.isModified("password")) return next();

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  // Debugging logs to check values
  console.log("Candidate Password:", candidatePassword);
  console.log("Stored Password:", this.password);

  if (!candidatePassword || !this.password) {
    throw new Error(
      "Password comparison requires both a candidate password and a stored password."
    );
  }

  return bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
