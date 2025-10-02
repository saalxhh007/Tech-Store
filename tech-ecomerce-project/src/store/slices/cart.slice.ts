import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Product {
  _id: string
  name: string
  price: number
  mainImage: string
  availibility: "In Stock" | "Out of Stock" | "Limited Stock"
}

interface cartItem {
  _id: string
  product: Product
  quantity: number
}

const initialState: cartItem[] = []

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<cartItem>) => {
      const existingIndex = state.findIndex(
        (item) => item._id === action.payload._id
      )
      if (existingIndex >= 0) {
        state[existingIndex].quantity += action.payload.quantity
      } else {
        state.push(action.payload)
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item._id !== action.payload)
    },

    clearCart: () => {
      return []
    },

    setCart: (state, action: PayloadAction<cartItem[]>) => {
      return action.payload
    },
  },
})

export const { addToCart, removeFromCart, clearCart, setCart } = cartSlice.actions
export default cartSlice.reducer