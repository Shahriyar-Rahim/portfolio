import express from "express";
import educationControlers from "../controllers/education.controller.js";
import protectMiddleware from "../middlewares/protect.js";

const router = express.Router();

router.get("/education", educationControlers.getAllEducations); // public
router.post("/education", protectMiddleware.protect, educationControlers.addEducation);
router.patch("/education/:id", protectMiddleware.protect, educationControlers.updateEducation);
router.delete("/education/:id", protectMiddleware.protect, educationControlers.deleteEducation);

export default router;
