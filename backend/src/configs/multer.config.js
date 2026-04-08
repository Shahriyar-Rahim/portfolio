import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/cloudinary.config.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "uploads",
        allowed_formats: ["jpg", "png", "jpeg", "webp", "pdf", "doc"]
    }
})