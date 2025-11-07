import { API_BASE_URL } from "../config/api";
import { Review as BackendReview } from "./reviewsService";

export type { BackendReview };

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
  reviews?: BackendReview[];
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  _userId: string;
  fullName: string;
  email: string;
}

export const getAllMovies = async (): Promise<Movie[]> => {
  try {
    console.log("Fetching movies from API:", `${API_BASE_URL}/movies`);

    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("API returned:", data);

    if (Array.isArray(data)) {
      return data.map((movie) => ({
        _id: movie._id || movie.id || Math.random().toString(),
        movieName: movie.movieName || movie.title || movie.name || "Untitled",
        releaseYear:
          movie.releaseYear ||
          (movie.releaseDate
            ? new Date(movie.releaseDate).getFullYear()
            : 2024),
        status: movie.status || "Now Showing",
        category: movie.category || movie.genre || "General",
        Director: movie.Director || movie.director,
        description: movie.description || movie.overview,
        bannerImage: movie.bannerImage || movie.posterUrl || movie.poster,
        rating: movie.rating || movie.voteAverage || 0,
        cast: movie.cast || [],
        reviews: (movie.reviews || []).map((review: any) => ({
          _id: review._id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          _userId: review._userId,
          fullName: review.fullName,
          email: review.email,
        })),
      }));
    }

    return [];
  } catch (err) {
    console.error("getAllMovies error:", err);
    return [];
  }
};

export const getMovieById = async (id: string): Promise<Movie> => {
  const res = await fetch(`${API_BASE_URL}/movies/${id}`);
  return await res.json();
};
