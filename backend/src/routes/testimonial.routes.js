import express from "express";
import testimonialControlers from "../controllers/testimonial.controller.js";
import protectMiddleware from "../middlewares/protect.js";
import upload from "../configs/multer.config.js";

const router = express.Router();

// public — visitors submit reviews, with up to 3 images
router.post(
  "/",
  upload.array("images", 3),
  testimonialControlers.addTestimonial,
);
router.get("/", testimonialControlers.getApprovedTestimonials); // public — approved only
router.get(
  "/all",
  protectMiddleware.protect,
  testimonialControlers.getAllTestimonials,
); // admin — includes pending
router.get(
  "/all/list",
  protectMiddleware.protect,
  testimonialControlers.getAllTestimonials,
); // admin alias
router.get("/:id", testimonialControlers.getTestimonial); // public — detail/"View" page
router.patch(
  "/:id",
  protectMiddleware.protect,
  testimonialControlers.updateTestimonial,
); // admin — edit
router.patch(
  "/:id/approve",
  protectMiddleware.protect,
  testimonialControlers.setTestimonialApproval,
); // admin
router.delete(
  "/:id",
  protectMiddleware.protect,
  testimonialControlers.deleteTestimonial,
);

export default router;
