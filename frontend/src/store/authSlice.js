import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem(TOKEN_KEY, action.payload.token);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.getItem(TOKEN_KEY);
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  loginSuccess,
  logout,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;