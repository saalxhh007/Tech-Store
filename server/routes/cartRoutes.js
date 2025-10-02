import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addItemsToCart, addItemToCart, clearCart, getCart, removeCartItem, updateCartItem } from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/add-items", protect, addItemsToCart);
cartRouter.post("/", protect, addItemToCart);
cartRouter.get("/", protect, getCart);
cartRouter.put("/update", protect, updateCartItem);
cartRouter.delete("/remove/:productId", protect, removeCartItem);
cartRouter.delete("/clear", protect, clearCart);

export default cartRouter;