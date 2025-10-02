import express from "express"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import path from "path"

import connectDB from "./config/db.js"
import userRouter from "./routes/authRoutes.js"
import productRouter from "./routes/productRoutes.js"
import imageRouter from "./routes/imageRoutes.js"
import statsRouter from "./routes/statsRoutes.js"
import orderRouter from "./routes/orderRoutes.js"
import cartRouter from "./routes/cartRoutes.js"
import favoriteRouter from "./routes/favorites.routes.js"

dotenv.config()

// Connect Database
connectDB()
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.json({limit: "20mb"}))
app.use(express.urlencoded({ limit: "10mb", extended: true }))

// Middleware
app.use(express.json())

app.use("/v1/api/user", userRouter)
app.use("/v1/api/product", productRouter)
app.use("/v1/api/images", imageRouter)
app.use("/v1/api/order", orderRouter)
app.use("/v1/api/cart", cartRouter)
app.use("/v1/api/favorite", favoriteRouter)
app.use("/v1/api/stats", statsRouter)

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))