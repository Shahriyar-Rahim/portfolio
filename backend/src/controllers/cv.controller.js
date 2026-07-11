import { createRequire } from "module";
import CvProfile from "../models/cvProfile.model.js";

const requre = createRequire(import.meta.url);
const PDFParse = requre("pdf-parse-new");

const textFields = ["name", "headline", "email", "phone", "location", "summary"];

const cleanText = (value) => (typeof value === "string" ? value.trim() : "");

const cleanSkills = (skills) =>
  Array.isArray(skills)
    ? [...new Set(skills.map(cleanText).filter(Boolean))].slice(0, 50)
    : [];

const cleanEntries = (entries, fields) =>
  Array.isArray(entries)
    ? entries
        .filter((entry) => entry && typeof entry === "object")
        .map((entry) =>
          Object.fromEntries(
            fields
              .map((field) => [field, cleanText(entry[field])])
              .filter(([, value]) => value),
          ),
        )
        .filter((entry) => Object.keys(entry).length)
        .slice(0, 20)
    : [];

const profileUpdate = (body = {}) => {
  const update = {};

  textFields.forEach((field) => {
    if (field in body) update[field] = cleanText(body[field]);
  });
  if ("skills" in body) update.skills = cleanSkills(body.skills);
  if ("experience" in body)
    update.experience = cleanEntries(body.experience, ["role", "company", "period"]);
  if ("projects" in body)
    update.projects = cleanEntries(body.projects, ["name", "description", "url"]);
  if ("education" in body)
    update.education = cleanEntries(body.education, ["degree", "institution", "period"]);

  return update;
};

const publicProfile = (profile) => {
  if (!profile) return null;
  const source = profile.toObject ? profile.toObject() : profile;
  const { parsedText, ...safeProfile } = source;
  return safeProfile;
};

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
    const profile = await CvProfile.findOne().sort({ updatedAt: -1 }).lean();
    res.status(200).json({ success: true, data: publicProfile(profile) });
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
        ...profileUpdate({ ...fallbackProfile, ...req.body }),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.status(200).json({ success: true, data: publicProfile(profile) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const updatePayload = profileUpdate(req.body);
    const profile = await CvProfile.findOneAndUpdate({}, updatePayload, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    res.status(200).json({ success: true, data: publicProfile(profile) });
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
    res.status(200).json({ success: true, data: publicProfile(profile) });
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
    res.status(200).json({ success: true, data: publicProfile(profile) });
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
