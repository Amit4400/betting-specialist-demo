import { createSlice } from '@reduxjs/toolkit';

// Load wallet balance from localStorage
const loadWalletBalance = () => {
  try {
    const saved = localStorage.getItem('walletBalance');
    if (saved !== null) {
      return parseFloat(saved) || 0;
    }
  } catch (e) {
    console.error('Error loading wallet balance:', e);
  }
  return 0;
};

const initialState = {
  walletBalance: loadWalletBalance(), // Load from localStorage
  bets: [],
  lockedAmount: 0,
};

const bettingSlice = createSlice({
  name: 'betting',
  initialState,
  reducers: {
    setWalletBalance: (state, action) => {
      state.walletBalance = action.payload;
      // Save to localStorage
      localStorage.setItem('walletBalance', state.walletBalance.toString());
      console.log('Wallet balance set to:', state.walletBalance);
    },
    addToWallet: (state, action) => {
      state.walletBalance += action.payload;
      // Save to localStorage
      localStorage.setItem('walletBalance', state.walletBalance.toString());
      console.log('Added to wallet:', action.payload, 'New balance:', state.walletBalance);
    },
    placeBackBet: (state, action) => {
      const { stake, odds, matchName } = action.payload;
      const bet = {
        id: Date.now(),
        type: 'back',
        stake,
        odds,
        matchName,
        potentialWin: stake * (odds - 1),
        timestamp: new Date().toISOString(),
      };
      state.bets.push(bet);
      state.walletBalance -= stake;
      // Save to localStorage
      localStorage.setItem('walletBalance', state.walletBalance.toString());
    },
    placeLayBet: (state, action) => {
      const { stake, odds, matchName } = action.payload;
      // Liability = Stake × (Odds - 1)
      const liability = stake * (odds - 1);
      const bet = {
        id: Date.now(),
        type: 'lay',
        stake,
        odds,
        matchName,
        liability,
        potentialWin: stake,
        timestamp: new Date().toISOString(),
      };
      state.bets.push(bet);
      state.walletBalance -= liability;
      // Save to localStorage
      localStorage.setItem('walletBalance', state.walletBalance.toString());
    },
  },
});

export const { setWalletBalance, addToWallet, placeBackBet, placeLayBet } = bettingSlice.actions;
export default bettingSlice.reducer;

