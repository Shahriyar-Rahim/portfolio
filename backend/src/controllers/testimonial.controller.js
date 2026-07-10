import Testimonial from "../models/testimonial.model.js";


const addTestimonial = async (req, res) => {
  try {
    const { clientName, address, feedback, rating, img } = req.body;

    if (!clientName || !feedback)
      return res.status(400).json({
        success: false,
        message: "Client name and feedback are required",
      });

    const testimonial = await Testimonial.create({
      clientName,
      address,
      feedback,
      rating,
      img,
      isApproved: false
    });

    res.status(201).json({ 
        success: true, 
        message: "Thank you! Your review is pending approval.",
        data: testimonial,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// Admin-only — lists every testimonial (approved and pending) so the owner
// can moderate submissions. getApprovedTestimonials below stays public/approved-only.
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Admin-only — approve or unapprove a submitted testimonial. Without this
// endpoint isApproved could never be flipped, so nothing ever reaches the
// public getApprovedTestimonials list.
const setTestimonialApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { isApproved: !!isApproved },
      { new: true },
    );

    if (!testimonial)
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });

    res.status(200).json({ success: true, data: testimonial });
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
  getAllTestimonials,
  setTestimonialApproval,
  deleteTestimonial
};

export default testimonialController;