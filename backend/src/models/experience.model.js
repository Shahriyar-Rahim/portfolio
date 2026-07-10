import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String },
    time: { type: String },
  },
  { timestamps: true },
);

const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;
