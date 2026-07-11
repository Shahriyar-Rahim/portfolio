import About from "../models/about.model.js";

const getAbout = async (req, res) => {
  try { res.status(200).json({ success: true, data: await About.findOne().sort({ updatedAt: -1 }) }); }
  catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

const updateAbout = async (req, res) => {
  try {
    const data = await About.findOneAndUpdate({}, req.body, { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true });
    res.status(200).json({ success: true, data });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

export default { getAbout, updateAbout };
