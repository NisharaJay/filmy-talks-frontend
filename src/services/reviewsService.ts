import axios from "axios";
import { API_BASE_URL } from "../config/api";

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  _userId: string;
  fullName: string;
  email: string;
}

export interface Movie {
  _id: string;
  movieName: string;
  releaseYear: number;
  status: string;
  category: string;
  Director?: string;
  description?: string;
  bannerImage?: string;
  rating?: number;
  cast?: string[];
  reviews?: Review[];
}

export const addReviewToMovie = async (
  movieId: string,
  comment: string,
  rating: number,
  token: string
) => {
  const res = await axios.post(
    `${API_BASE_URL}/movies/${movieId}/reviews`,
    { comment, rating },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
