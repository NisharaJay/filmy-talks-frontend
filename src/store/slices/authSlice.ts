import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
  _id: string;
  fullName: string;
  email: string;
  token: string;
  favorites: string[];
};

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: {
    _id: "",
    fullName: "",
    email: "",
    token: "",
    favorites: [],
  },
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login
    loginRequest: (
      state,
      action: PayloadAction<{ email: string; password: string }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User }>) => {
      const user = action.payload.user;
      state.user = user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    loginFailure: (state, action: PayloadAction<{ error: string }>) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload.error;
    },

    // Signup
    signupRequest: (
      state,
      action: PayloadAction<{
        fullName: string;
        email: string;
        password: string;
      }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    signupSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    signupFailure: (state, action: PayloadAction<{ error: string }>) => {
      state.loading = false;
      state.error = action.payload.error;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },
    updateUserFavorites: (state, action: PayloadAction<string[]>) => {
      if (state.user) {
        state.user.favorites = action.payload;
      }
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  signupRequest,
  signupSuccess,
  signupFailure,
  logout,
  clearError,
  updateUserFavorites,
} = authSlice.actions;

export default authSlice.reducer;