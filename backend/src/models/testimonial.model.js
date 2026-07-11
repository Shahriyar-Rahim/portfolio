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
    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length <= 3,
        message: "A testimonial can have at most 3 images",
      },
      default: [],
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