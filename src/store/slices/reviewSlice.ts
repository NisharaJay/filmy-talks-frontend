import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LocalReview {
  fullName: string;
  rating: number;
  comment: string;
  _userId?: string;
  email?: string;
}

interface ReviewState {
  reviewsByMovie: {
    [movieId: string]: LocalReview[];
  };
  loading: boolean;
  error: string | null;
}

interface AddReviewRequestPayload {
  movieId: string;
  rating: number;
  comment: string;
  userName: string;
  token: string;
  _userId?: string;
  email?: string;
}

interface AddReviewSuccessPayload {
  movieId: string;
  rating: number;
  comment: string;
  userName: string;
  _userId?: string;
  email?: string;
}

const initialState: ReviewState = {
  reviewsByMovie: {},
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    addReviewRequest: (state, _action: PayloadAction<AddReviewRequestPayload>) => {
      state.loading = true;
      state.error = null;
    },
    addReviewSuccess: (state, action: PayloadAction<AddReviewSuccessPayload>) => {
      state.loading = false;

      const { movieId, rating, comment, userName, _userId, email } = action.payload;
      const newReview: LocalReview = { fullName: userName, rating, comment, _userId, email };

      if (!state.reviewsByMovie[movieId]) {
        state.reviewsByMovie[movieId] = [];
      }

      state.reviewsByMovie[movieId].push(newReview);
    },
    addReviewFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { addReviewRequest, addReviewSuccess, addReviewFailure } = reviewSlice.actions;

export default reviewSlice.reducer;