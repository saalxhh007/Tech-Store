import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

export const addItemsToCart = async (req, res) => {
  try {
    const userId = req.user.id
    const { collection } = req.body
    console.log(collection);
    
    if (!Array.isArray(collection) || collection.length === 0) {
      return res.status(400).json({ message: "Collection must contain products" })
    }

    let cart = await cartModel.findOne({ user: userId })

    if (!cart) {
      cart = new cartModel({ user: userId, items: [] })
    }

    for (const item of collection) {
      const existingItem = cart.items.find(
        (i) => i.product.toString() === item.product
      )

      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        const product = await productModel.findById(item.product)
        if (!product) continue

        cart.items.push({ product: item.product, quantity: item.quantity })
      }
    }

    await cart.save()
    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: "Error adding items", error })
  }
}

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id
    const cart = await cartModel.findOne({ user: userId }).populate("items.product")
    if (!cart) return res.json({ items: [] })

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error })
  }
}

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id
    const { productId, quantity } = req.body

    const cart = await cartModel.findOne({ user: userId })
    if (!cart) return res.status(404).json({ message: "Cart not found" })

    const item = cart.items.find((i) => i.product.toString() === productId)
    if (!item) return res.status(404).json({ message: "Item not found in cart" })

    item.quantity = quantity
    await cart.save()

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: "Error updating cart item", error })
  }
}

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id
    const { productId } = req.params

    const cart = await cartModel.findOne({ user: userId })
    if (!cart) return res.status(404).json({ message: "Cart not found" })

    cart.items = cart.items.filter((i) => i.product.toString() !== productId)
    await cart.save()

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: "Error removing cart item", error })
  }
}

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id
    let cart = await cartModel.findOne({ user: userId })

    if (!cart) return res.status(404).json({ message: "Cart not found" })

    cart.items = []
    await cart.save()

    res.json(cart)
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error })
  }
}

export const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id
    const { product_id, quantity } = req.body

    if (!product_id || !quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required" })
    }

    let cart = await cartModel.findOne({ user: userId })
    if (!cart) {
      cart = new cartModel({ user: userId, items: [] })
    }

    const existingItem = cart.items.find(
      (i) => i.product.toString() === product_id
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      const product = await productModel.findById(product_id)
      if (!product) {
        return res.status(404).json({ message: "Product not found" })
      }
      cart.items.push({ product: product_id, quantity })
    }

    await cart.save()
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding item", error })
  }
}