import Testimonial from "../models/testimonial.model.js";


const addTestimonial = async (req, res) => {
  try {
    const { clientName, designation, comment, rating, img } = req.body;

    const testimonial = await Testimonial.create({
      clientName,
      designation,
      comment,
      rating,
      img,
      isApproved: false
    });

    res.status(201).json({ 
        success: true, 
        message: "Thank you! Your review is pending approval." 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isApproved: true });
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// controllers/testimonialController.js
import Testimonial from "../models/testimonial.model.js";

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "Testimonial ID is required" 
      });
    }

    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return res.status(404).json({ 
        success: false, 
        message: "Testimonial not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while deleting",
      error: error.message,
    });
  }
};

const testimonialController = {
  addTestimonial,
  getApprovedTestimonials,
  deleteTestimonial
};

export default testimonialController;