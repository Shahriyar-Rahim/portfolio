import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    group: { type: String }, // e.g., "Science", "Computer Science"
    subject: { type: String }, // e.g., "Software Engineering"
    gpa: { type: Number, min: 0, max: 5.0 }, // Assuming a 5.0 scale
    startYear: { type: Number },
    endYear: { type: Number },
  },
  { timestamps: true },
);
const Education = mongoose.model("Education", educationSchema);
export default Education;
