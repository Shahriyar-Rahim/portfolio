import Education from "../models/education.model.js";

// Create/Add Education
const addEducation = async (req, res) => {
  try {
    // Now including new fields in destructuring
    const { institution, degree, group, subject, gpa, startYear, endYear } =
      req.body;

    const newEducation = await Education.create({
      user: req.user._id,
      institution,
      degree,
      group,
      subject,
      gpa,
      startYear,
      endYear,
    });
    res.status(201).json(newEducation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Education (same logic applies for PUT/PATCH)
const updateEducation = async (req, res) => {
  try {
    const updated = await Education.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body, // This will update whatever fields are passed
      { new: true },
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public — visitors viewing the portfolio need to see education entries
// without logging in. This is a single-owner site, so we just return
// everything sorted by most recent start year.
const getAllEducations = async (req, res) => {
  try {
    const educations = await Education.find().sort({ startYear: -1 });

    res.status(200).json({
      success: true,
      message: "Educations fetched successfully",
      data: educations,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
  }
};

// NOTE: this was previously a broken duplicate of getAllEducations (didn't
// actually delete anything). Implemented properly as a real delete, protected.
const deleteEducation = async (req, res) => {
  try {
    const deleted = await Education.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Education not found" });

    res.status(200).json({
      success: true,
      message: "Education deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
  }
};

const educationController = {
  addEducation,
  updateEducation,
  getAllEducations,
  deleteEducation,
};

export default educationController;