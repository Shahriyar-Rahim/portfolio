import express from "express";
import experienceControlers from "../controllers/experience.controller.js";
import protectMiddleware from "../middlewares/protect.js";

const router = express.Router();

router.get("/", experienceControlers.getAllExperiences); // public
router.post("/", protectMiddleware.protect, experienceControlers.addExperience);
router.patch("/:id", protectMiddleware.protect, experienceControlers.updateExperience);
router.delete("/:id", protectMiddleware.protect, experienceControlers.deleteExperience);

export default router;
