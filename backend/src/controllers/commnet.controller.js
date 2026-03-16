const comment = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { text, userId } = req.body;

        if(!text || !userId || !blogId) return res.status(400).json({success: false, message: "All fields are required"});

        const newComment = await Comment.create({
            blog: blogId,
            user: userId,
            text
        })

        await Blog.findByIdAndUpdate(blogId, {
            $push: {
                comments: newComment._id
            }
        });

        res.status(201).json({success: true, message: "Comment created successfully", data: newComment});
    } catch (error) {
        res.status(500).json({success: false, message: "Something went wrong", error: error.message});
    }
};

const getComments = async (req, res) => {
    try {
        const { blogId } = req.params;
        if(!blogId) return res.status(400).json({success: false, message: "Blog id is required"});

        const comments = await Comment.find({blog: blogId}).populate('user', 'name');

        res.status(200).json({success: true, message: "Comments fetched successfully", data: comments});
    } catch (error) {
        res.status(500).json({success: false, message: "Something went wrong", error: error.message});
    }
};

const editComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;

        if(!commentId || !text) return res.status(400).json({success: false, message: "All fields are required"});

        const comment = await Comment.findById(commentId);

        if(!comment) return res.status(404).json({success: false, message: "Comment not found"});

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { text },
            { new: true }
        );

        res.status(200).json({success: true, message: "Comment updated successfully", data: updatedComment});
    } catch (error) {
        res.status(500).json({success: false, message: "Something went wrong", error: error.message});
    }
};

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        if(!commentId) return res.status(400).json({success: false, message: "Comment id is required"});

        const comment = await Comment.findById(commentId);

        if(!comment) return res.status(404).json({success: false, message: "Comment not found"});

        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({success: true, message: "Comment deleted successfully"});
    } catch (error) {
        res.status(500).json({success: false, message: "Something went wrong", error: error.message});
    }
};

const commentController = {
    comment,
    getComments,
    editComment,
    deleteComment
};

export default commentController;