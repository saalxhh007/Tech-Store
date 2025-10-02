import userModel from "../models/user.model.js";
import productModel from "../models/product.model.js";

// ✅ Get user favorites
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId).populate("favorites");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: "Error fetching favorites", error });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) return res.status(400).json({ message: "Product ID required" });

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.favorites.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }

    res.json({ message: "Product added to favorites", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Error adding favorite", error });
  }
};

// ✅ Remove from favorites
export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== productId
    );
    await user.save();

    res.json({ message: "Product removed from favorites", favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Error removing favorite", error });
  }
};

// ✅ Clear favorites
export const clearFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.favorites = [];
    await user.save();

    res.json({ message: "Favorites cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing favorites", error });
  }
};
