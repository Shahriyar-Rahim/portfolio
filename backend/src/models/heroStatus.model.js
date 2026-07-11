import mongoose from "mongoose";

// Backs the hero section's "status.log" panel — lets the admin edit the
// displayed roles/processes without a code deploy.
const heroStatusSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true }, // e.g. "syntecxhub-internship"
    detail: { type: String, required: true }, // e.g. "Software Engineering Intern · remote"
    status: {
      type: String,
      enum: ["running", "idle", "stopped"],
      default: "running",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const HeroStatus = mongoose.model("HeroStatus", heroStatusSchema);
export default HeroStatus;
