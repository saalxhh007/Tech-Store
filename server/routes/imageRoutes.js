import express from "express";
import { uploadImage, getImagesByProduct, deleteImage } from "../controllers/imageController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const imageRouter = express.Router()

imageRouter.post("/", upload.single("image"), uploadImage);
imageRouter.get("/:productId", getImagesByProduct)
imageRouter.delete("/:id", protect, admin, deleteImage)

export default imageRouter