import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: number | null
  full_name: string | null
  email: string | null
}

export interface AuthState {
  accessToken: string | null
  role: string | null
  user: User
  expires_in: string | null
  expires_at: number | null
  isAuthenticated: boolean
  
}

export interface SetAuthPayload {
  accessToken: string
  role: string
  user: User
  expires_in: string
  expires_at: number
}

const initialState: AuthState = {
  accessToken: null,
  role: null,
  user: { id: null, full_name: null, email: null },
  expires_in: null,
  expires_at: null,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<SetAuthPayload>) => {
      state.accessToken = action.payload.accessToken;
      state.role = action.payload.role;
      state.user.id = action.payload.user.id;
      state.user.full_name = action.payload.user.full_name;
      state.user.email = action.payload.user.email;
      state.expires_in = action.payload.expires_in;
      state.expires_at = action.payload.expires_at;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.role = null;
      state.user.id = null;
      state.user.full_name = null;
      state.user.email = null;
      state.expires_in = null;
      state.expires_at = null;
      state.isAuthenticated = false;
    },
  },
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer