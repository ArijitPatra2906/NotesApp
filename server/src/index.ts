import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import noteRoutes from "./routes/noteRoutes";

// Load environment variables from a `.env` file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4040;

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  throw new Error("MONGO_URL is not defined in environment variables.");
}

// Connect to MongoDB
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err: Error) => {
    console.error("Error occurred!!");
    console.error(err);
  });

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Notes app server");
});

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/note", noteRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
