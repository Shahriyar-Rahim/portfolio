import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET
})

// multer-storage-cloudinary expects the Cloudinary namespace and calls
// cloudinary.v2.uploader internally. Do not export cloudinary.v2 here.
export default cloudinary;
