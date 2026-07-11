import express from "express";
import jobController from "../controllers/job.controller.js";
import protectMiddleware from "../middlewares/protect.js";

const router = express.Router();

router.get("/", jobController.getJobs);
router.get("/all", protectMiddleware.protect, jobController.getJobs);
router.get("/recommended", jobController.getRecommendedJobs);
router.get("/:id", jobController.getJob);
router.post("/", protectMiddleware.protect, jobController.createJob);
router.patch("/:id", protectMiddleware.protect, jobController.updateJob);
router.delete("/:id", protectMiddleware.protect, jobController.deleteJob);
router.post("/:id/apply", jobController.applyToJob);

export default router;
