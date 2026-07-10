import express from "express";
import blogControlers from "../controllers/blog.controller.js";
import protectMiddleware from "../middlewares/protect.js";

const router = express.Router();

router.get("/", blogControlers.allBlog); // public
router.get("/:id", blogControlers.singleBlog); // public
router.post("/create-blog", protectMiddleware.protect, blogControlers.createBlog);
router.patch("/:id", protectMiddleware.protect, blogControlers.updateBlog);
router.delete("/:id", protectMiddleware.protect, blogControlers.deleteBlog);

export default router;
