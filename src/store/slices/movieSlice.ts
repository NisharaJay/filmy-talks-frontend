import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "../../services/movieService";

interface MovieState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  movies: [],
  loading: false,
  error: null,
};

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    fetchMoviesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMoviesSuccess(state, action: PayloadAction<Movie[]>) {
      state.movies = action.payload;
      state.loading = false;
    },
    fetchMoviesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchMoviesRequest, fetchMoviesSuccess, fetchMoviesFailure } = movieSlice.actions;
export default movieSlice.reducer;