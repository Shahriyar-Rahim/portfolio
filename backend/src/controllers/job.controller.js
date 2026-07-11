import Job from "../models/job.model.js";
import { sendMailSafe } from "../configs/mailer.config.js";

const getJobs = async (req, res) => {
  try {
    const { role, skills, jobType } = req.query;
    const filter = { isActive: true };

    if (role) filter.role = new RegExp(role, "i");
    if (jobType) filter.jobType = jobType;
    if (skills) {
      const parsedSkills = String(skills)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      if (parsedSkills.length) filter.skills = { $all: parsedSkills };
    }

    const jobs = await Job.find(filter).sort({ postedAt: -1 });
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndDelete(id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });
    res
      .status(200)
      .json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const applyToJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, coverLetter } = req.body;
    const job = await Job.findById(id);

    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });
    if (!name || !email)
      return res
        .status(400)
        .json({ success: false, message: "Name and email are required" });

    await sendMailSafe({
      from: `"Portfolio Jobs" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_RECIPIENT || process.env.SMTP_USER,
      subject: `Application for ${job.title}`,
      text: `${name} (${email}) applied for ${job.title}\n\n${coverLetter || "No cover letter provided."}`,
      html: `<div style="font-family:Arial,sans-serif;padding:24px"><h2>New application</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Role:</strong> ${job.title}</p><p><strong>Message:</strong><br />${(coverLetter || "No cover letter provided.").replace(/\n/g, "<br />")}</p></div>`,
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Application received. I will be in touch soon.",
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const jobController = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
};
export default jobController;
