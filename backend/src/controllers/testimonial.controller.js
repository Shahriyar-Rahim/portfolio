import Testimonial from "../models/testimonial.model.js";
import { sendMailSafe } from "../configs/mailer.config.js";

const addTestimonial = async (req, res) => {
  try {
    const { clientName, address, feedback, rating, email } = req.body;

    if (!clientName || !feedback)
      return res.status(400).json({
        success: false,
        message: "Client name and feedback are required",
      });

    // req.files comes from multer (upload.array("images", 3)) with
    // CloudinaryStorage — each file's `.path` is already the hosted URL.
    const images = (req.files || []).map((file) => file.path);

    const testimonial = await Testimonial.create({
      clientName,
      address,
      feedback,
      rating,
      images,
      isApproved: false,
    });

    // Best-effort notifications — submission still succeeds either way.
    const ownerEmail = process.env.EMAIL_RECIPIENT || process.env.SMTP_USER;
    const senderEmail = process.env.EMAIL_USER || process.env.SMTP_USER;

    await sendMailSafe({
      from: `"Portfolio Testimonials" <${senderEmail}>`,
      to: ownerEmail,
      subject: `New testimonial from ${clientName}`,
      text: `${clientName} left a testimonial (${rating || "no"} star rating):\n\n${feedback}`,
    });

    if (email) {
      await sendMailSafe({
        from: `"Md. Shahriyar Rahim" <${senderEmail}>`,
        to: email,
        subject: "Thank you for your feedback!",
        text: `Hi ${clientName},\n\nThank you for taking the time to leave a testimonial! It's currently pending review and will appear on the site shortly.\n\nBest regards,\nMd. Shahriyar Rahim`,
      });
    }

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

// Public — single testimonial detail view (the "View" button destination).
const getTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);

    if (!testimonial)
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });

    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Admin-only — edit the text fields of a submitted testimonial (typos,
// light moderation edits). Distinct from setTestimonialApproval, which only
// toggles visibility.
const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientName, address, feedback, rating } = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { clientName, address, feedback, rating },
      { new: true, runValidators: true },
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
        message: "Testimonial ID is required",
      });
    }

    const deletedTestimonial = await Testimonial.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
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
  getTestimonial,
  setTestimonialApproval,
  updateTestimonial,
  deleteTestimonial,
};

export default testimonialController;
