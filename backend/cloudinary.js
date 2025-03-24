import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: "dwdzv9jjo",
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {

    const [fileType,fileExtension] = file.mimetype.split('/');

    return {
      folder: "uploads",
      format:fileExtension === 'mpeg'?'mp3':fileExtension,
      resource_type: fileType === 'image' ? 'image' : fileType === 'video' ? 'video' : fileType === 'audio' ? 'video' : 'raw',
      public_id: file.originalname.split(".").slice(0, -1).join("."),
    };
  },
});

const upload = multer({ storage });
export default upload;
