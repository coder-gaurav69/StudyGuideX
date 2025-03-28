import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const [fileType, fileExtension] = file.mimetype.split('/');

    return {
      folder: "uploads",
      format: fileExtension === 'mpeg' ? 'mp3' : fileExtension,
      resource_type: fileType === 'image' ? 'image' : 'raw',  // Let Cloudinary decide for non-image files
      public_id: file.originalname.split(".").slice(0, -1).join(".") + "-" + Date.now(), // Unique ID
    };
  },
});



const deleteFile = async (publicId, fileType) => {
  try {
    let resourceType = "raw"; // Default type for PDFs and other files

    if (fileType === "image") {
      resourceType = "image";
    } else if (fileType === "video" || fileType === "audio") {
      resourceType = "video"; // Cloudinary treats audio as video for deletion
    }

    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log(`Deleted ${fileType}:`, result);
    return result;
  } catch (error) {
    console.error(`Error deleting ${fileType}:`, error);
  }
};

const upload = multer({ storage,limits:{fileSize:10*1024*1024} });

export {upload,deleteFile};
