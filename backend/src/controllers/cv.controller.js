import { createRequire } from "module";
import CvProfile from "../models/cvProfile.model.js";

const requre = createRequire(import.meta.url);
const PDFParse = requre("pdf-parse-new");

const extractProfileFromText = (text) => {
  const lines = (text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const name = lines[0] || "";
  const summaryLines = lines.slice(1, 4).join(" ");
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = text.match(/\+?\d[\d\s().-]{7,}\d/);
  const locationMatch = text.match(
    /([A-Z][a-z]+(?:,\s*[A-Z][a-z]+)?(?:,\s*[A-Za-z\s]+)?)$/m,
  );

  return {
    name,
    summary: summaryLines || "",
    email: emailMatch ? emailMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0] : "",
    location: locationMatch ? locationMatch[1] : "",
    skills: [
      ...new Set(
        (
          text.match(
            /(?:React|Node|Express|MongoDB|JavaScript|TypeScript|Tailwind|Next|Python|AWS|Docker|UI|UX|API)/gi,
          ) || []
        ).map((item) => item.trim()),
      ),
    ],
  };
};

const readUploadedText = async (fileUrl, mimetype) => {
  try {
    if (!fileUrl) return "";

    const response = await fetch(fileUrl);
    if (!response.ok) return "";

    const buffer = Buffer.from(await response.arrayBuffer());

    if (mimetype?.includes("pdf")) {
      const parser = new PDFParse({ data: buffer });
      try {
        const parsed = await parser.getText();
        return parsed.text || "";
      } finally {
        await parser.destroy();
      }
    }

    return buffer.toString("utf8");
  } catch (error) {
    console.error("CV parse failed", error);
    return "";
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await CvProfile.findOne().sort({ updatedAt: -1 });
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const uploadCv = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "CV file is required" });

    const parsedText = await readUploadedText(req.file.path, req.file.mimetype);
    const fallbackProfile = extractProfileFromText(parsedText);
    const profile = await CvProfile.findOneAndUpdate(
      {},
      {
        cvUrl: req.file.path,
        parsedText,
        name: req.body.name || fallbackProfile.name || "",
        headline: req.body.headline || "",
        email: req.body.email || fallbackProfile.email || "",
        phone: req.body.phone || fallbackProfile.phone || "",
        location: req.body.location || fallbackProfile.location || "",
        summary: req.body.summary || fallbackProfile.summary || "",
        skills: req.body.skills || fallbackProfile.skills || [],
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updatePayload = { ...req.body };
    const profile = await CvProfile.findOneAndUpdate({}, updatePayload, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Profile image is required" });
    }
    if (!req.file.mimetype?.startsWith("image/")) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload an image file" });
    }

    const profile = await CvProfile.findOneAndUpdate(
      {},
      { profileImageUrl: req.file.path },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const removeProfileImage = async (req, res) => {
  try {
    const profile = await CvProfile.findOneAndUpdate(
      {},
      { $unset: { profileImageUrl: 1 } },
      { new: true },
    );
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "CV profile not found" });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const cvController = {
  getProfile,
  uploadCv,
  updateProfile,
  uploadProfileImage,
  removeProfileImage,
};
export default cvController;
