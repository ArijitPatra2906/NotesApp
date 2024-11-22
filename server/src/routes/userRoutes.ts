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
    const { name, email, dob } = req.body;

    console.log(name, email, dob);

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    try {
      // Check if the user already exists
      let user = await User.findOne({ name });

      if (!user) {
        // If the user doesn't exist, create a new one
        user = new User({ name, email, dob });
      }

      // Generate OTP and set expiration time
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await user.save();

      // Here, send the OTP to the user's email (mocked for now)
      console.log(`OTP for ${email}: ${otp}`);

      // Send OTP via email using the sendOTPEmail function
      const emailSent = await sendOTPEmail(email, otp);

      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send OTP email." });
      }

      return res.status(200).json({ message: "OTP sent to your email." });
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

      // Mark the user as verified
      user.isVerified = true;
      user.otp = null;
      user.otpExpiration = null;

      await user.save();

      // Optionally, generate a token (e.g., JWT) to keep the user authenticated
      const token = generateToken(user); // Assuming generateToken is a function that generates a JWT token

      return res.status(200).json({
        message: "User verified successfully.",
        token,
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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const otp = generateOTP();

      user.isVerified = false;
      user.otp = otp;
      user.otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await user.save();

      // Send OTP via email using the sendOTPEmail function
      const emailSent = await sendOTPEmail(email, otp);

      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send OTP email." });
      }

      return res.status(200).json({
        message: "OTP sent to your email.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
);

export default router;
