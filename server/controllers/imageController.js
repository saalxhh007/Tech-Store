import imageModel from "../models/image.model.js";
import productModel from "../models/product.model.js";

export const uploadImage = async (req, res) => {
  try {
    const { productId } = req.body
    if (!req.file) return res.status(400).json({ message: "No file uploaded" })

    const url = `/uploads/${req.file.filename}`

    const image = await imageModel.create({
      product: productId,
      url,
      alt: req.file.originalname,
    })

    await productModel.findByIdAndUpdate(productId, { $push: { images: image._id } })

    res.status(201).json(image)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getImagesByProduct = async (req, res) => {
  try {
    const { productId } = req.params
    const images = await imageModel.find({ product: productId })
    res.json(images)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)
    if (!image) return res.status(404).json({ message: "Image not found" })

    await Product.findByIdAndUpdate(image.product, { $pull: { images: image._id } })
    await image.deleteOne()

    res.json({ message: "Image deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}