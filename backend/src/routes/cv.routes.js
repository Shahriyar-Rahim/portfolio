import express from "express";
import cvController from "../controllers/cv.controller.js";
import protectMiddleware from "../middlewares/protect.js";
import upload from "../configs/multer.config.js";

const router = express.Router();

router.get("/profile", cvController.getProfile);
router.post(
  "/upload",
  protectMiddleware.protect,
  upload.single("cv"),
  cvController.uploadCv,
);
router.patch("/profile", protectMiddleware.protect, cvController.updateProfile);
router.post(
  "/profile/image",
  protectMiddleware.protect,
  upload.single("image"),
  cvController.uploadProfileImage,
);
router.delete("/profile/image", protectMiddleware.protect, cvController.removeProfileImage);

export default router;
