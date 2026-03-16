import express from "express";
import testimonialControlers from "../controllers/testimonial.controller.js";

const router = express.Router();

router.post("/", testimonialControlers.addTestimonial);
router.get("/", testimonialControlers.getApprovedTestimonials);
router.delete("/:id", testimonialControlers.deleteTestimonial);

export default router;