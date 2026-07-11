import Comment from "../models/comment.model.js";

// Comments on this portfolio's blog are left by anonymous visitors (name + email),
// matching the Comment model — there is no logged-in "userId" for public commenters.
const comment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { name, email, comment: text } = req.body;

    if (!text || !name || !email || !blogId)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    const newComment = await Comment.create({
      blogID: blogId,
      name,
      email,
      comment: text,
    });

    res
      .status(201)
      .json({
        success: true,
        message: "Comment created successfully",
        data: newComment,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
  }
};

const getComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!blogId)
      return res
        .status(400)
        .json({ success: false, message: "Blog id is required" });

    const comments = await Comment.find({ blogID: blogId }).sort({
      createdAt: -1,
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Comments fetched successfully",
        data: comments,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
  }
};

const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!commentId || !text)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    const comment = await Comment.findById(commentId);

    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { text },
      { returnDocument: "after" },
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Comment updated successfully",
        data: updatedComment,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!commentId)
      return res
        .status(400)
        .json({ success: false, message: "Comment id is required" });

    const comment = await Comment.findById(commentId);

    if (!comment)
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });

    await Comment.findByIdAndDelete(commentId);

    res
      .status(200)
      .json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
  }
};

const commentController = {
  comment,
  getComments,
  editComment,
  deleteComment,
};

export default commentController;
