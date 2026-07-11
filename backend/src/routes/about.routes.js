import express from "express";
import aboutController from "../controllers/about.controller.js";
import protectMiddleware from "../middlewares/protect.js";

const router = express.Router();
router.get("/", aboutController.getAbout);
router.patch("/", protectMiddleware.protect, aboutController.updateAbout);
export default router;
