import { call, put, takeLatest } from "redux-saga/effects";
import { addReviewToMovie } from "../../services/reviewsService";
import {
  addReviewRequest,
  addReviewSuccess,
  addReviewFailure,
} from "../slices/reviewSlice";
import { fetchMoviesRequest } from "../slices/movieSlice";

function* handleAddReview(action: any): any {
  try {
    const { movieId, comment, rating, token, userName, _userId, email } = action.payload;

    yield call(addReviewToMovie, movieId, comment, rating, token);

    yield put(
      addReviewSuccess({ movieId, comment, rating, userName, _userId, email })
    );

    yield put(fetchMoviesRequest());

  } catch (error: any) {
    yield put(addReviewFailure(error.message));
  }
}

export default function* reviewSaga() {
  yield takeLatest(addReviewRequest.type, handleAddReview);
}