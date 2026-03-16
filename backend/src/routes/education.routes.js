import express from "express";
import educationControlers from "../controllers/education.controller.js";

const router = express.Router();

router.post("/education", educationControlers.addEducation);
router.get("/education", educationControlers.getAllEducations);
router.patch("/education/:id", educationControlers.updateEducation);
router.delete("/education/:id", educationControlers.deleteEducation);

export default router;