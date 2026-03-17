import express from "express";
import blogControlers from "../controllers/blog.controller.js";

const router = express.Router();

router.post("/create-blog", blogControlers.createBlog);
router.get("/", blogControlers.allBlog);
router.get("/:id", blogControlers.singleBlog);
router.patch("/:id", blogControlers.updateBlog);
router.delete("/:id", blogControlers.deleteBlog);

export default router;