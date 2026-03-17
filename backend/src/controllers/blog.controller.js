import Blog from "../models/blog.model.js";

const createBlog = async (req, res) => {
  try {
    const blogData = req.body;
    const result = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.toString(),
    });
  }
};

const allBlog = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const count = await Blog.countDocuments();
    const totalPage = Math.ceil(count / limit);


    if (!blogs)
      return res
        .status(404)
        .json({ success: false, message: "Blogs not found" });
    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      data: blogs,
      meta: {
        total: count,
        page,
        limit,
        totalPage
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const singleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "No id provided" });
    const blog = await Blog.findById(id);
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    res
      .status(200)
      .json({
        success: true,
        message: "Blog fetched successfully",
        data: blog,
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

const updateBlog = async (req, res) => {
    try {
    const { id } = req.params;
    const { title, img, category, description, shortDescription } = req.body;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "No id provided" });
    const blog = await Blog.findByIdAndUpdate(
        id,
        {
            title,
            img,
            category,
            description,
            shortDescription
        },
        {
            new: true
        }
    );
    if (!blog)
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    res
      .status(200)
      .json({
        success: true,
        message: "Blog updated successfully",
        data: blog,
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

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id){
            return res
            .status(400)
            .json({ success: false, message: "No id provided" });
        }
        const result = await Blog.findByIdAndDelete(id);
        if (!result){
            return res
            .status(404)
            .json({ success: false, message: "Blog not found" });
        }
        res
        .status(200)
        .json({
            success: true,
            message: "Blog deleted successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        })
    }
};

const blogControllers = {
  createBlog,
  allBlog,
  singleBlog,
  updateBlog,
  deleteBlog,
};

export default blogControllers;
