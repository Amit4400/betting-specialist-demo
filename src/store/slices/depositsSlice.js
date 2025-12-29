import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  depositRequests: [],
};

// Load from localStorage if available (for persistence across refreshes)
const savedDeposits = localStorage.getItem('depositRequests');
if (savedDeposits) {
  try {
    initialState.depositRequests = JSON.parse(savedDeposits);
  } catch (e) {
    console.error('Error loading saved deposits:', e);
  }
}

const depositsSlice = createSlice({
  name: 'deposits',
  initialState,
  reducers: {
    createDepositRequest: (state, action) => {
      const { userId, userName, amount, screenshot } = action.payload;
      const newRequest = {
        id: Date.now(),
        userId,
        userName,
        amount,
        screenshot,
        status: 'pending',
        timestamp: new Date().toISOString(),
      };
      state.depositRequests.push(newRequest);
      // Save to localStorage for persistence
      localStorage.setItem('depositRequests', JSON.stringify(state.depositRequests));
      console.log('Deposit request created and saved:', newRequest);
      console.log('All deposit requests in state:', state.depositRequests);
    },
    approveDeposit: (state, action) => {
      const requestId = action.payload;
      const request = state.depositRequests.find(r => r.id === requestId);
      if (request && request.status === 'pending') {
        request.status = 'approved';
        // Save to localStorage for persistence
        localStorage.setItem('depositRequests', JSON.stringify(state.depositRequests));
      }
    },
  },
});

export const { createDepositRequest, approveDeposit } = depositsSlice.actions;
export default depositsSlice.reducer;

