import Job from "../models/job.model.js";
import { sendEmail } from "../configs/mailer.config.js";
import CvProfile from "../models/cvProfile.model.js";

const recommendationCache = new Map();
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

const stripHtml = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const getSearchTerms = (profile) => {
  const terms = [
    ...(profile.skills || []),
    profile.headline,
    ...(profile.experience || []).flatMap((item) => [item.role, item.title]),
  ]
    .filter(Boolean)
    .join(" ")
    .split(/[,|/\n]+|\s{2,}/)
    .map((item) => item.trim())
    .filter((item) => item.length > 1)
    .slice(0, 8);

  return [...new Set(terms)].join(" ").slice(0, 120);
};

const scoreJob = (job, terms) => {
  const text = `${job.title} ${job.category} ${stripHtml(job.description)}`.toLowerCase();
  return terms.reduce((score, term) => score + (text.includes(term.toLowerCase()) ? 1 : 0), 0);
};

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

const getRecommendedJobs = async (req, res) => {
  try {
    const profile = await CvProfile.findOne().sort({ updatedAt: -1 }).lean();
    if (!profile) {
      return res.status(404).json({ success: false, message: "Upload a CV in the admin panel before searching for matching jobs." });
    }

    const search = getSearchTerms(profile);
    if (!search) {
      return res.status(400).json({ success: false, message: "Add skills or a headline to your CV profile before searching for jobs." });
    }

    const cached = recommendationCache.get(search);
    if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
      return res.status(200).json({ success: true, data: cached.jobs, search, cached: true });
    }

    const sourceUrl = new URL("https://remotive.com/api/remote-jobs");
    sourceUrl.searchParams.set("search", search);
    sourceUrl.searchParams.set("limit", "50");
    const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("The job provider is temporarily unavailable");
    const payload = await response.json();
    const terms = search.split(/\s+/).filter((term) => term.length > 1);
    const jobs = (payload.jobs || [])
      .map((job) => ({
        externalId: String(job.id),
        title: job.title,
        company: job.company_name,
        companyLogo: job.company_logo,
        location: job.candidate_required_location || "Remote",
        role: job.category || "Remote role",
        skills: terms.filter((term) => `${job.title} ${stripHtml(job.description)}`.toLowerCase().includes(term.toLowerCase())),
        jobType: job.job_type || "remote",
        description: stripHtml(job.description).slice(0, 450),
        applyUrl: job.url,
        sourcePlatform: "Remotive",
        postedAt: job.publication_date,
        matchScore: scoreJob(job, terms),
      }))
      .sort((a, b) => b.matchScore - a.matchScore || new Date(b.postedAt) - new Date(a.postedAt))
      .slice(0, 20);

    recommendationCache.set(search, { createdAt: Date.now(), jobs });
    res.status(200).json({ success: true, data: jobs, search, cached: false });
  } catch (error) {
    res.status(502).json({ success: false, message: error.message || "Unable to fetch matching jobs right now." });
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

    await sendEmail({
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
  getRecommendedJobs,
  createJob,
  updateJob,
  deleteJob,
  applyToJob,
};
export default jobController;
