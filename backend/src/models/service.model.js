import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String, required: true },
  },
  { timestamps: true },
);

const Service = mongoose.model("Service", serviceSchema);
export default Service;
