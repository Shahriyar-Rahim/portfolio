import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import connectDB from "./configs/database.config.js";
import dns from "dns";
import userRoutes from "./routes/user.routes.js";
import commentRoutes from "./routes/comment.route.js";
import educationRoutes from "./routes/education.routes.js";
import experienceRoutes from "./routes/experience.routes.js";
import fileRoutes from "./routes/file.routes.js";
import inboxRoutes from "./routes/inbox.routes.js";
import serviceRoutes from "./routes/service.route.js";
import testimonialRoutes from "./routes/testimonial.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import heroStatusRoutes from "./routes/heroStatus.routes.js";
import jobRoutes from "./routes/job.routes.js";
import cvRoutes from "./routes/cv.routes.js";
import githubRoutes from "./routes/github.routes.js";
import authRecoveryRoutes from "./routes/authRecovery.routes.js";
import aboutRoutes from "./routes/about.routes.js";

import { authLimiter, generalLimiter } from "./middlewares/rateLimiter.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dotenv.config();

const app = express();

connectDB();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || origin.includes("no-idea.top")) {
        return callback(null, true);
      }

      return callback(null, true);
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authLimiter, userRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/me", educationRoutes);
app.use("/api/v1/me/experience", experienceRoutes);
app.use("/api/v1/file", fileRoutes);
app.use("/api/v1/inbox", generalLimiter, inboxRoutes);
app.use("/api/v1/service", serviceRoutes);
app.use("/api/v1/testimonial", testimonialRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/hero-status", heroStatusRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/cv", cvRoutes);
app.use("/api/v1/portfolio/github", githubRoutes);
app.use("/api/v1/auth/recovery", authRecoveryRoutes);
app.use("/api/v1/about", aboutRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "File is too large (max 10MB).",
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err) {
    // your existing fileFilter throws a plain Error() for unsupported types
    return res.status(400).json({ success: false, message: err.message });
  }

  next();
});

app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
