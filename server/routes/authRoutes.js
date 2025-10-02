import express from "express";
import { admin, protect } from "../middleware/authMiddleware.js";
import { deleteUser, getAllCustomers, loginUser, logoutUser, refreshToken, registerUser, sendVerificationEmail, updateUser } from "../controllers/authController.js";

const userRouter = express.Router()

// Public Routes
userRouter.post("/signup", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/logout", logoutUser)
userRouter.post("/refresh-token", refreshToken)
userRouter.post("/send-verification-email", sendVerificationEmail)

// Admin-only Routes
userRouter.get("/", protect, admin, getAllCustomers)
userRouter.delete("/delete-user/:id", protect, admin, deleteUser)
userRouter.put("/update-user/:id", protect, admin, getAllCustomers)

export default userRouter