import { Router, Request, Response } from "express";
import Note from "../models/noteSchema";
import { verifyToken } from "../middleware/veifytokenMiddleware";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log(token);

    if (!token) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Use the utility function to verify token and get the user
    const user = await verifyToken(token);

    const { title } = req.body;

    const newNote = new Note({
      title,
      createById: user._id,
    });

    await newNote.save();
    res.status(200).json({ message: "Note saved successfully" });
  } catch (err: unknown) {
    console.error(err);

    if (err instanceof Error) {
      if (
        err.message === "Authentication failed" ||
        err.message === "Invalid token or expired token" ||
        err.message === "User not found"
      ) {
        return res.status(401).json({ message: err.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const user = await verifyToken(token);

    const notes = await Note.find({ createById: user._id });
    console.log(notes);

    if (!notes.length) {
      return res.status(200).json({ message: "No notes found" });
    }

    res.status(200).json(notes);
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) {
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a note by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Use the utility function to verify token and get the user
    const user = await verifyToken(token);

    const { id } = req.params;

    // Find the note by ID and check if it belongs to the logged-in user
    const note = await Note.findOne({ _id: id, createById: user._id });

    if (!note) {
      return res.status(404).json({
        message:
          "Note not found or you don't have permission to delete this note",
      });
    }

    // Use findByIdAndDelete to delete the note
    await Note.findByIdAndDelete(id);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err: unknown) {
    console.error(err);
    if (err instanceof Error) {
      return res.status(500).json({ message: "Internal server error" });
    }
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
