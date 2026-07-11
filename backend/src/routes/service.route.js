import express from "express";
import serviceController from "../controllers/service.controller.js";
import protectMiddleware from "../middlewares/protect.js";
import upload from "../configs/multer.config.js";

const router = express.Router();

router.get("/", serviceController.getAllServices); // public
router.get("/:id", serviceController.getService); // public
router.post("/", protectMiddleware.protect, upload.single("image"), serviceController.createService);
router.patch("/:id", protectMiddleware.protect, upload.single("image"), serviceController.updateService);
router.delete("/:id", protectMiddleware.protect, serviceController.deleteService);

export default router;
