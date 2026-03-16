import Experience from "../models/experience.model.js";

const addExperience = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { title, company, description, time } = req.body;

    if (!title || !company || !description || !time)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    const newExperience = await Experience.create({
      user: user._id,
      title,
      company,
      description,
      time,
    });

    res.status(201).json({
      success: true,
      message: "Experience added successfully",
      data: newExperience,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong adding experience",
      error: error.message,
    });
  }
};

const getAllExperiences = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const experiences = await Experience.find({ user: user._id });

    if (!experiences)
      return res
        .status(404)
        .json({ success: false, message: "Experiences not found" });

    res.status(200).json({
      success: true,
      message: "Experiences fetched successfully",
      data: experiences,
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

const updateExperience = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { _id } = req.params;

    if (!_id)
      return res
        .status(400)
        .json({ success: false, message: "Experience id is required" });

    const experience = await Experience.findById(_id);

    if (!experience)
      return res
        .status(404)
        .json({ success: false, message: "Experience not found" });

    //using spread operator
    const updatedData = { ...req.body };

    const updated = await Experience.findOneAndUpdate(
      { _id, user: user._id },
      updatedData,
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      data: updated,
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

const deleteExperience = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { _id } = req.params;

    if (!_id)
      return res
        .status(400)
        .json({ success: false, message: "Experience id is required" });

    const experience = await Experience.findById(_id);

    if (!experience)
      return res
        .status(404)
        .json({ success: false, message: "Experience not found" });

    await Experience.findByIdAndDelete(_id);

    res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
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

const experienceController = {
  addExperience,
  getAllExperiences,
  updateExperience,
  deleteExperience,
};
export default experienceController;
