import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bettingReducer from './slices/bettingSlice';
import depositsReducer from './slices/depositsSlice';

// Preload wallet balance from localStorage
const loadWalletBalance = () => {
  try {
    const saved = localStorage.getItem('walletBalance');
    if (saved !== null) {
      return parseFloat(saved) || 0;
    }
  } catch (e) {
    console.error('Error loading wallet balance in store:', e);
  }
  return 0;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    betting: bettingReducer,
    deposits: depositsReducer,
  },
  preloadedState: {
    betting: {
      walletBalance: loadWalletBalance(),
      bets: [],
      lockedAmount: 0,
    },
  },
});

