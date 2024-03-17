import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "uploads", // Optional: specify a folder to upload the file to
    });
    return result.secure_url;
  } catch (err) {
    console.error("Error uploading to Cloudinary:", err);
    throw err;
  }
};
