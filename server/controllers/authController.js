import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" })
}

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" })
}
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body.formattedData
    
    const userExists = await userModel.findOne({ email })
    if (userExists) return res.status(400).json({ message: "User already exists" })

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
      fullName,
      email,
      passwordHash: hashedPassword,
      role: "customer",
    })

    res.status(201).json({ message: "User registered", user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body.formData
    
    const user = await userModel.findOne({ email })
    if (!user) return res.status(400).json({ message: "Invalid credentials" })
    
    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return res.status(400).json({ message: "Invalid credentials" })
    
    const payload = { id: user.id, email: user.email, fullName: user.fullName, role: user.role }

    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)
    const expiresIn = '15m'
    const expiresAt = Math.floor(Date.now() / 1000) + parseInt(expiresIn) * 60
    const payloadUser = {
        id: payload.id,
        full_name: payload.fullName,
        email: payload.email
    }
    user.refreshToken = refreshToken
    await user.save()
    res.json({
      accessToken,
      role: payload.role,
      user: payloadUser,
      expires_in: expiresIn,
      expires_at: expiresAt
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body

    const user = await userModel.findOne({ refreshToken });
    if (!user) return res.status(400).json({ message: "Invalid token" })

    user.refreshToken = null
    await user.save()

    res.json({ message: "Logged out successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.headers.refreshToken

  if (!refreshToken) return res.status(401).json({ message: "No token provided" })

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" })

    const accessToken = generateAccessToken(decoded.id, decoded.role)
    res.json({ accessToken })
  })
}

export const sendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body
    res.json({ message: `Verification email sent to ${email}` })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id)
    res.json({ message: "User deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await userModel
      .find({ role: "customer" })
      .select("-passwordHash -refreshToken")
      .sort({ createdAt: -1 })

    res.status(200).json(customers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}