import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import cartModel from "../models/cart.model.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { products, shippingAddress } = req.body;

    const totalPrice = products.reduce(
      (sum, p) => sum + p.priceAtPurchase * p.quantity,
      0
    );
    const order = await orderModel.create({
      userId,
      products,
      totalPrice,
      paymentMethod: "cash-on-delivery",
      shippingAddress,
      status: "pending",
    });

    await userModel.findByIdAndUpdate(userId, { $set: { cart: [] } });
    await cartModel.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } } 
    )

    // for (const p of products) {
    //   await LogBook.create({
    //     product: p.productId,
    //     user: userId,
    //     quantity: p.quantity,
    //   });
    // }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("userId", "fullName email")
      .populate("products.productId", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await orderModel
      .findById(req.params.id)
      .populate("userId", "fullName email")
      .populate("products.productId", "name price");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.deleteOne();
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderModel
      .find({ userId })
      .populate("products.productId", "name price mainImage")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};