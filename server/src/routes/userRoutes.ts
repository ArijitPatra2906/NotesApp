import express, { Request, Response, Router } from "express";
import User from "../models/userSchema";
import { sendOTPEmail } from "../services/emailService";
import { generateToken } from "../services/generateToken";

const router: Router = express.Router(); // Explicitly typing the router

// Helper function to generate a random 6-digit OTP
const generateOTP = (): number => Math.floor(100000 + Math.random() * 900000);

// Sign up route
router.post(
  "/signup",
  async (req: Request, res: Response): Promise<Response> => {
    const { name, email, dob, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    try {
      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ message: "User already registered, please sign in." });
      }

      // Create a new user instance
      user = new User({
        name,
        email,
        dob: dob || null, // Assign null if `dob` is not provided
        password, // Plain password; will be hashed in the `pre` save middleware
      });

      // Generate OTP and set expiration time
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await user.save();

      // Here, send the OTP to the user's email
      console.log(`OTP for ${email}: ${otp}`);

      const emailSent = await sendOTPEmail(email, otp);
      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send OTP email." });
      }

      return res.status(200).json({
        message: "OTP sent to your email.Please verify your email.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);

// Verify OTP route
router.post(
  "/verify",
  async (req: Request, res: Response): Promise<Response> => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Check if OTP is valid and not expired
      if (user.otp !== parseInt(otp, 10) || new Date() > user.otpExpiration!) {
        return res.status(400).json({ message: "Invalid or expired OTP." });
      }

      // Mark the user as verified and clear OTP-related fields
      user.isVerified = true;
      user.otp = null;
      user.otpExpiration = null;

      // Save without validation for the `password` field
      await user.save({ validateModifiedOnly: true });

      return res.status(200).json({
        message: "User verified successfully. Now you can sign in.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);

// Sign in route
router.post(
  "/signin",
  async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required." });
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (!user.isVerified) {
        return res.status(401).json({ message: "Please verify your email." });
      }

      // Compare the provided password with the stored hashed password
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password." });
      }

      const token = generateToken(user);

      return res.status(200).json({
        message: "Sign in successfully",
        user,
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);

export default router;
