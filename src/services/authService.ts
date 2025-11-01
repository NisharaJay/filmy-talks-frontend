// src/services/authService.ts
import { API_BASE_URL } from "../config/api";

// Common request handler
const makeRequest = async (endpoint: string, options: RequestInit) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Login
export const loginUser = async (email: string, password: string) => {
  return makeRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

// Signup
export const registerUser = async (fullName: string, email: string, password: string) => {
  return makeRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ fullName, email, password }),
  });
};

// Validate token (optional - for token refresh/validation)
export const validateToken = async (token: string) => {
  return makeRequest("/auth/validate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};