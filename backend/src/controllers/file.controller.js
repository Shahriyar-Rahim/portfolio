const uploadFile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { filename, path, mimetype } = req.file;
    if (!filename || !path || !mimetype)
      return res
        .status(400)
        .json({ success: false, message: "File is not valid" });

    const file = await File.create({
      filename,
      path,
      mimetype,
      user: user._id,
    });
    res
      .status(201)
      .json({
        success: true,
        message: "File uploaded successfully",
        data: file,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const removeFile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "File id is required" });

    const file = await File.findById(id);
    if (!file)
      return res
        .status(404)
        .json({ success: false, message: "File not found" });

    if (file.user.toString() !== user._id)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    await file.remove();
    res
      .status(200)
      .json({
        success: true,
        message: "File deleted successfully",
        data: file,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getAllFiles = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const files = await File.find({ user: user._id });
    if (!files)
      return res
        .status(404)
        .json({ success: false, message: "Files not found" });

    res
      .status(200)
      .json({
        success: true,
        message: "Files fetched successfully",
        data: files,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const fileControllers = { uploadFile, removeFile, getAllFiles };

export default fileControllers;
