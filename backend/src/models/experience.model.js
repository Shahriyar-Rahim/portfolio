import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String },
    time: { type: String },
  },
  { timestamps: true },
);

const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;
