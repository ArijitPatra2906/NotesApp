import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (id: any) => {
  const secret = process.env.JWT_SECRET || "defaultSecret";
  return jwt.sign({ id }, secret, {
    expiresIn: "365d",
  });
};
