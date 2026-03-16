import express from "express";
import experienceControlers from "../controllers/experience.controller.js";

const router = express.Router();

router.post("/", experienceControlers.addExperience);
router.get("/add", experienceControlers.getAllExperiences);
router.patch("/:id", experienceControlers.updateExperience);
router.delete("/:id", experienceControlers.deleteExperience);

export default router;