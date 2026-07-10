import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "./cloudinary.config.js"


const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder: "uploads",
        allowed_formats: ["jpg", "png", "jpeg", "heic", "webp"],
    }
});

const upload = multer({ storage }); //middleware

export default upload;