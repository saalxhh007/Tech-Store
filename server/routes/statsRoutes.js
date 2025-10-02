import express from "express";
import {
  getProductsOfTheWeek,
  getTopDeals,
  getRecommendedProducts,
  getMostPopularProducts,
  getAdminStats,
  getMonthlySales,
  getCustomerActivity,
  getRevenueGrowth,
  getAverageOrderValue,
} from "../controllers/statsController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const statsRouter = express.Router();

// Public Store Stats
statsRouter.get("/products-of-the-week", getProductsOfTheWeek);
statsRouter.get("/top-deals", getTopDeals);
statsRouter.get("/recommended/:userId", getRecommendedProducts);
statsRouter.get("/most-popular", getMostPopularProducts);

// Admin Dashboard Stats
statsRouter.get("/admin", protect, admin, getAdminStats);
statsRouter.get("/monthly", protect, admin, getMonthlySales);
statsRouter.get("/revenue-growth", protect, admin, getRevenueGrowth);
statsRouter.get("/customer-activity", protect, admin, getCustomerActivity);
statsRouter.get("/average-order-value", protect, admin, getAverageOrderValue);

export default statsRouter;
