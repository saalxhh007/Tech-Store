import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    // id: {type: UUID}
    name: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    mainImage: { type: String, required: false },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "Image" }],
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    availability: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Limited Stock"],
      default: "In Stock",
    },
    description: { type: String },
    features: [{ type: String }],
    colors: [{ type: String }],
    tags: [{ type: String }],
    brand: { type: String },
    isNew: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model("Product", productSchema) 