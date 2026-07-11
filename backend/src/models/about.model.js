import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  title: { type: String, default: "Two disciplines, one engineer", trim: true },
  intro: { type: String, default: "", trim: true },
  details: { type: String, default: "", trim: true },
  toolchain: { type: [{ label: String, value: String }], default: [] },
}, { timestamps: true, versionKey: false });

export default mongoose.model("About", aboutSchema);
