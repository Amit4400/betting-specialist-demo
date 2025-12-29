import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: false,
};

// Load from localStorage on init
const savedUser = localStorage.getItem('bettingUser');
if (savedUser) {
  initialState.user = JSON.parse(savedUser);
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { username, password, role } = action.payload;
      state.user = {
        username,
        role,
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem('bettingUser', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('bettingUser');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

