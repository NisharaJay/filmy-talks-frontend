import { call, put, takeLatest } from "redux-saga/effects";
import { getAllMovies, Movie } from "../../services/movieService";
import {
  fetchMoviesRequest,
  fetchMoviesSuccess,
  fetchMoviesFailure,
} from "../slices/movieSlice";

function* handleFetchMovies(): Generator<unknown, void, Movie[]> {
  try {
    const movies: Movie[] = yield call(getAllMovies);
    yield put(fetchMoviesSuccess(movies));
  } catch (error: any) {
    yield put(fetchMoviesFailure(error.message || "Failed to fetch movies"));
  }
}

export default function* movieSaga() {
  yield takeLatest(fetchMoviesRequest.type, handleFetchMovies);
}