import express from "express";
import fileControlers from "../controllers/file.controller.js";
import upload from "../configs/multer.config.js";
import protectMiddleware from "../middlewares/protect.js";

const router = express.Router();

router.post("/", protectMiddleware.protect, upload.single("file"), fileControlers.uploadFile);
router.get("/", protectMiddleware.protect, fileControlers.getAllFiles);
router.delete("/:id", protectMiddleware.protect, fileControlers.removeFile);

export default router;
