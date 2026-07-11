import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./configs/database.config.js";
import dns from "dns";
import rateLimit from "express-rate-limit";
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

const port = process.env.PORT;
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

connectDB();

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
app.use("/api/v1/auth", authRecoveryRoutes);
app.use("/api/v1/about", aboutRoutes);

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Internal Server Error" });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
