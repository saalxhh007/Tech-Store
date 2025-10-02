import express from "express";

import { protect, admin } from "../middleware/authMiddleware.js";
import { createProduct, deleteProduct, getProductById, getProducts, getProductsByCategory, updateProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", getProducts)
productRouter.get("/:id", getProductById)
productRouter.get("/category/:category", getProductsByCategory)

productRouter.post("/", createProduct)
productRouter.put("/:id", updateProduct)
productRouter.delete("/:id", deleteProduct)

export default productRouter