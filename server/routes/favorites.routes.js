import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addFavorite, clearFavorites, getFavorites, removeFavorite } from "../controllers/favorites.controller.js";

const favoriteRouter = express.Router();

favoriteRouter.get("/", protect, getFavorites);
favoriteRouter.post("/", protect, addFavorite);
favoriteRouter.delete("/:productId", protect, removeFavorite);
favoriteRouter.delete("/", protect, clearFavorites);

export default favoriteRouter