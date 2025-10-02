import categoryModel from "../models/category.model.js";
import productModel from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, isNew, isOnSale, isFeatured } = req.query

    let query = {}

    if (search) {
      query.name = { $regex: search, $options: "i" }
    }

    if (category) {
      const categoryDoc = await categoryModel.findOne({ name: category })
      if (categoryDoc) query.category = categoryDoc._id
      else query.category = null
    }

    if (isNew) query.isNew = isNew === "true"
    if (isOnSale) query.isOnSale = isOnSale === "true"
    if (isFeatured) query.isFeatured = isFeatured === "true"

    const products = await productModel
      .find(query)
      .populate("images")
      .populate("category")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .exec();

    const count = await productModel.countDocuments(query);

    const mappedProducts = products.map((p) => ({
      _id: p._id,
      name: p.name,
      category: p.category?.name || "Unknown",
      price: p.price,
      originalPrice: p.originalPrice || undefined,
      mainImage: p.mainImage || (p.images[0]?.url ?? ""),
      images: p.images?.map((img) => img.url) || [],
      rating: p.rating,
      reviews: p.reviews,
      availability: p.availability,
      description: p.description,
      features: p.features || [],
      colors: p.colors || [],
      tags: p.tags || [],
      brand: p.brand,
      isNew: p.isNew,
      isFeatured: p.isFeatured,
      isOnSale: p.isOnSale,
    }));

    res.json({
      products: mappedProducts,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
  }

export const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id)

    if (!product) return res.status(404).json({ message: "Product not found" })

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getProductsByCategory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const { category } = req.params

    const products = await productModel.find({ category })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const count = await productModel.countDocuments({ category })

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createProduct = async (req, res) => {
  try {
    const { name, category, price, description, brand, mainImage} = req.body

    let categoryDoc = await categoryModel.findOne({ slug: category });
    if (!categoryDoc) {
      categoryDoc = await categoryModel.create({
        name: category.charAt(0).toUpperCase() + category.slice(1),
        slug: category,
      });
    }
    
    const product = new productModel({
      name,
      category: categoryDoc._id,
      price,
      description,
      brand,
      mainImage
    })

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    if (!product) return res.status(404).json({ message: "Product not found" })

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id)

    if (!product) return res.status(404).json({ message: "Product not found" })

    res.json({ message: "Product deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}