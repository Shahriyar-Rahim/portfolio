import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { 
      type: String, 
      required: [true, "Client name is required"],
      trim: true 
    },
    address: { 
      type: String,
      trim: true
    },
    img: { 
      type: String,
      default: "https://example.com/default-avatar.png"
    },
    feedback: { 
      type: String, 
      required: [true, "Feedback is required"],
      maxlength: [500, "Feedback cannot exceed 500 characters"] 
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    isApproved: { 
      type: Boolean, 
      default: false
    },
  },
  { timestamps: true },
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;