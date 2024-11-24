import { User } from "./models/userSchema"; // Adjust the path to your User model

declare global {
  namespace Express {
    interface Request {
      user?: User; // You can also make it non-optional if you always expect it
    }
  }
}
