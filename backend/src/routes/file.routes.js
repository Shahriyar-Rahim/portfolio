import express from "express";
import fileControlers from "../controllers/file.controller.js";

const router = express.Router();

router.post("/", fileControlers.uploadFile);
router.get("/", fileControlers.getAllFiles);
router.delete("/:id", fileControlers.removeFile);

export default router;