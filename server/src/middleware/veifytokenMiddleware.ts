import User from "../models/userSchema";
import jwt from "jsonwebtoken";

export const verifyToken = async (token: string) => {
  if (!token) {
    throw new Error("Authentication failed");
  }

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret");
  } catch (err) {
    throw new Error("Invalid token or expired token");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
