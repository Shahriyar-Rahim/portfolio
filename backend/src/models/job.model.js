import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company is required"],
      trim: true,
    },
    location: { type: String, default: "Remote", trim: true },
    role: { type: String, default: "Software Engineer", trim: true },
    skills: { type: [String], default: [] },
    jobType: {
      type: String,
      enum: ["remote", "on-site", "hybrid", "internship"],
      default: "remote",
    },
    description: { type: String, required: [true, "Description is required"] },
    applyUrl: { type: String, trim: true },
    sourcePlatform: { type: String, default: "Structured input" },
    isActive: { type: Boolean, default: true },
    postedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false },
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
