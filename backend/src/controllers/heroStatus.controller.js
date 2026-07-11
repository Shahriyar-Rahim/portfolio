import HeroStatus from "../models/heroStatus.model.js";

// Public — the hero section fetches this list to render its status panel.
const getAllHeroStatus = async (req, res) => {
  try {
    const items = await HeroStatus.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createHeroStatus = async (req, res) => {
  try {
    const { name, detail, status, order } = req.body;

    if (!name || !detail)
      return res.status(400).json({ success: false, message: "Name and detail are required" });

    const item = await HeroStatus.create({
      user: req.user._id,
      name,
      detail,
      status,
      order,
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateHeroStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await HeroStatus.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true },
    );

    if (!item)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteHeroStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await HeroStatus.findOneAndDelete({ _id: id, user: req.user._id });

    if (!item)
      return res.status(404).json({ success: false, message: "Not found" });

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const heroStatusController = {
  getAllHeroStatus,
  createHeroStatus,
  updateHeroStatus,
  deleteHeroStatus,
};

export default heroStatusController;
