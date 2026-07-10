import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String },
  },
  { timestamps: true },
);

const File = mongoose.model("File", fileSchema);
export default File;
