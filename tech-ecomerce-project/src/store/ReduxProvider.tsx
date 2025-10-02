'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { useTokenRefresh } from '../lib/useTokenRefresh';
import { persistor, store } from '.';
function TokenRefreshWrapper() {
  useTokenRefresh()
  return null
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <TokenRefreshWrapper />
        {children}
      </PersistGate>
    </Provider>
  )
}