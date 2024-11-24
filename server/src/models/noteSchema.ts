import mongoose, { Document, Schema } from "mongoose";

// Define the Note interface
interface INote extends Document {
  title: string;
  createdAt: Date;
  updatedAt: Date;
  createById: mongoose.Types.ObjectId; // User reference
}

// Define the schema for the Note
const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    createById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Export the Note model
const Note = mongoose.model<INote>("Note", NoteSchema);
export default Note;
