import express from "express";
import testimonialControlers from "../controllers/testimonial.controller.js";
import protectMiddleware from "../middlewares/protect.js";

const router = express.Router();

router.post("/", testimonialControlers.addTestimonial); // public — visitors submit reviews
router.get("/", testimonialControlers.getApprovedTestimonials); // public — approved only
router.get("/all", protectMiddleware.protect, testimonialControlers.getAllTestimonials); // admin — includes pending
router.patch("/:id/approve", protectMiddleware.protect, testimonialControlers.setTestimonialApproval); // admin
router.delete("/:id", protectMiddleware.protect, testimonialControlers.deleteTestimonial);

export default router;
