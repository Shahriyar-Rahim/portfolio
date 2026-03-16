import express from "express";
import commentControlers from "../controllers/commnet.controller.js";

const router = express.Router();

router.post('/blog/:blogId/comment', commentControlers.comment);

router.get('/blog/:blogId', commentControlers.getComments);

router.patch('/:commentId', commentControlers.editComment);

router.delete('/:commentId', commentControlers.deleteComment);

export default router;