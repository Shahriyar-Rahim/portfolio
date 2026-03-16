import Service from "../models/service.model.js";

const createService = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { title, description, img } = req.body;

    if (!title || !description || !img)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    const newService = await Service.create({
      user: user._id,
      title,
      description,
      img,
    });

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      data: newService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong adding service",
      error: error.message,
    });
  }
};

const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Service id is required" });
    }

    const updatedService = await Service.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: req.body },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found or you are not authorized to edit this.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong updating service",
      error: error.message,
    });
  }
};

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Service id is required" });
    }

    const deletedService = await Service.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deletedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found or you are not authorized to delete this.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong deleting service",
      error: error.message,
    });
  }
};

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ user: user._id });

    if (services.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No services found",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      data: services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getService = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Service id is required" });

    const service = await Service.findById(id);

    if (!service)
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });

    res.status(200).json({
      success: true,
      message: "Service fetched successfully",
      data: service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const serviceController = {
  createService,
  updateService,
  deleteService,
  getAllServices,
  getService,
};

export default serviceController;
