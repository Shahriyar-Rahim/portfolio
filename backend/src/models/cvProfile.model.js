import mongoose from "mongoose";

const cvProfileSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    headline: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    summary: { type: String, trim: true },
    skills: { type: [String], default: [] },
    experience: { type: [Object], default: [] },
    projects: { type: [Object], default: [] },
    education: { type: [Object], default: [] },
    profileImageUrl: { type: String, trim: true },
    cvUrl: { type: String, trim: true },
    parsedText: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false },
);

const CvProfile = mongoose.model("CvProfile", cvProfileSchema);
export default CvProfile;
