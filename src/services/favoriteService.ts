// favoriteService.ts
import { API_BASE_URL } from "../config/api";

export const addFavorite = async (movieId: string, token: string) => {
  const res = await fetch(`${API_BASE_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ movieId }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Status: ${res.status}, Message: ${text}`);
  return JSON.parse(text);
};

export const removeFavorite = async (movieId: string, token: string) => {
  const res = await fetch(`${API_BASE_URL}/favorites/${movieId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Status: ${res.status}, Message: ${text}`);
  return JSON.parse(text);
};

export const getFavorites = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/favorites`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Status: ${res.status}, Message: ${text}`);
  const data = JSON.parse(text);
  return Array.isArray(data) ? data : data.favorites || [];
};
