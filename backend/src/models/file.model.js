import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String },
  },
  { timestamps: true },
);

const File = mongoose.model("File", fileSchema);
export default File;
