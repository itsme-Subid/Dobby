import express from "express";
import multer from "multer";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import fetchUser from "../middleware/fetchUser.js";
import Image from "../models/Image.js";

const router = express.Router();

const storage = multer.diskStorage({});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB max file size
  },
});

// POST /api/images/upload
router.post("/upload", fetchUser, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  try {
    const { file } = req;
    const url = await uploadToCloudinary(file);
    const { mimetype, size } = file;
    const image = new Image({
      userId: req.user.id,
      name: file.originalname,
      path: url,
      type: mimetype,
      size,
    });
    await image.save();
    res.status(200).json({
      message: "Image uploaded successfully",
      image,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/images/search?q=example // search images by name
router.get("/search", fetchUser, async (req, res) => {
  const { q } = req.query;
  try {
    const images = q
      ? await Image.find({
          userId: req.user.id,
          name: { $regex: q, $options: "i" },
        })
      : await Image.find({ userId: req.user.id });
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
