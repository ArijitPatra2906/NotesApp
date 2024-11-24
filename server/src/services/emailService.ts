import nodemailer from "nodemailer";

// Create a reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other email services like SendGrid or Mailgun
  auth: {
    user: "patraarijit440@gmail.com",
    pass: "lhglrqgdspyjqjie",
  },
});

// Helper function to send OTP email
export const sendOTPEmail = async (
  email: string,
  otp: number
): Promise<boolean> => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Your email address
    to: email, // Recipient's email address
    subject: "Your OTP for Signup",
    text: `Your OTP for registration is: ${otp}.OTP will be valid for 24 hours`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP sent:", info.response);
    return true; // Email sent successfully
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false; // Email failed to send
  }
};
