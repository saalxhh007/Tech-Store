import mongoose from "mongoose"

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    description: { type: String },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model("Category", categorySchema)