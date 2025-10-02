import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getUserOrders
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.post("/", protect, createOrder);
orderRouter.get("/", protect, admin, getOrders);
orderRouter.get("/:id", protect, getOrderById);
orderRouter.put("/:id/status", protect, admin, updateOrderStatus);
orderRouter.delete("/:id", protect, admin, deleteOrder);
orderRouter.get("/my/orders", protect, getUserOrders);

export default orderRouter