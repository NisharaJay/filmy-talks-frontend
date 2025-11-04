import { API_BASE_URL } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../store";

const getAuthToken = async () => {
  const state: any = store.getState();
  let token = state.auth?.user?.token;

  if (!token) {
    const userString = await AsyncStorage.getItem("persist:root");
    if (userString) {
      const parsed = JSON.parse(userString);
      const authState = JSON.parse(parsed.auth);
      token = authState.user?.token;
    }
  }

  return token;
};

export const addFavorite = async (movieId: string) => {
  const token = await getAuthToken();
  console.log("Token:", token);

  const res = await fetch(`${API_BASE_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ movieId }),
  });

  const text = await res.text();
  console.log("ADD FAVORITE RESPONSE:", res.status, text);

  if (!res.ok) {
    throw new Error(`Status: ${res.status}, Message: ${text}`);
  }

  return JSON.parse(text);
};

export const removeFavorite = async (movieId: string) => {
  const token = await getAuthToken();
  console.log("Token:", token);

  const res = await fetch(`${API_BASE_URL}/favorites/${movieId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const text = await res.text();
  console.log("REMOVE FAVORITE RESPONSE:", res.status, text);

  if (!res.ok) {
    throw new Error(`Status: ${res.status}, Message: ${text}`);
  }

  return JSON.parse(text);
};

export const getFavorites = async () => {
  const token = await getAuthToken();
  console.log("Token:", token);

  const res = await fetch(`${API_BASE_URL}/favorites`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  const text = await res.text();
  console.log("GET FAVORITES RESPONSE:", res.status, text);

  if (!res.ok) {
    throw new Error(`Status: ${res.status}, Message: ${text}`);
  }

  const data = JSON.parse(text);
  return data.favorites || [];
};
