import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import axios from 'axios'
import { logout, setAuth } from '../store/slices/auth.slice'

let refreshTimer: NodeJS.Timeout | null = null

const setupTokenRefreshTimer = (refreshTime: number, callback: () => void) => {
  clearTokenRefreshTimer()
  refreshTimer = setTimeout(callback, refreshTime)
}

const clearTokenRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer)
    refreshTimer = null
  }
}

const refreshAccessToken = async (dispatch: any) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_EVENTIA_API}/v1/api/user/refresh-token`,
      {},
      {
        withCredentials: true,
      }
    )

    const { accessToken, role, user, expires_in, expires_at } = response.data
    dispatch(setAuth({
      accessToken,
      expires_in,
      role,
      expires_at,
      user
    }))
    
    setupTokenRefreshTimer(14 * 60 * 1000, () => {
      refreshAccessToken(dispatch)
    })
  } catch (err) {
    console.error('❌ Token refresh failed:', err)
  }
}

export const useTokenRefresh = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated) {
      setupTokenRefreshTimer(14 * 60 * 1000, () => {
        refreshAccessToken(dispatch)
      })
    } else {
      dispatch(logout())
    }

    return () => {
      clearTokenRefreshTimer()
    }
  }, [isAuthenticated, dispatch])
}