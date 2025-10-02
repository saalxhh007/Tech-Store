import mongoose from "mongoose"

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  altText: { type: String },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  uploadedAt: { type: Date, default: Date.now },
})

export default mongoose.model("Image", imageSchema)