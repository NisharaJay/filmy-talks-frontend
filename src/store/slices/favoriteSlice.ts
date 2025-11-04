import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "../../services/movieService";

interface FavoriteState {
  favorites: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoriteState = {
  favorites: [],
  loading: false,
  error: null,
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addFavoriteRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
    },
    addFavoriteSuccess: (state, action: PayloadAction<Movie[]>) => {
      state.loading = false;
      state.favorites = action.payload;
    },
    addFavoriteFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    removeFavoriteRequest: (state, _action: PayloadAction<string>) => {
      state.loading = true;
    },
    removeFavoriteSuccess: (state, action: PayloadAction<Movie[]>) => {
      state.loading = false;
      state.favorites = action.payload;
    },
    removeFavoriteFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchFavoritesRequest: (state) => {
      state.loading = true;
    },
    fetchFavoritesSuccess: (state, action: PayloadAction<Movie[]>) => {
      state.loading = false;
      state.favorites = action.payload;
    },
    fetchFavoritesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  addFavoriteRequest,
  addFavoriteSuccess,
  addFavoriteFailure,
  removeFavoriteRequest,
  removeFavoriteSuccess,
  removeFavoriteFailure,
  fetchFavoritesRequest,
  fetchFavoritesSuccess,
  fetchFavoritesFailure,
} = favoriteSlice.actions;

export default favoriteSlice.reducer;