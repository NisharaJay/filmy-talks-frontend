// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type User = {
  fullName: string;
  email: string;
  token: string;
};

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Login
    loginRequest: (state, action: PayloadAction<{ email: string; password: string }>) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
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
    signupRequest: (state, action: PayloadAction<{ fullName: string; email: string; password: string }>) => {
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
    
    // Clear errors
    clearError: (state) => {
      state.error = null;
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
} = authSlice.actions;

export default authSlice.reducer;