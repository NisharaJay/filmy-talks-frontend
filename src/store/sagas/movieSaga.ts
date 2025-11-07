//movieSaga.ts
import { call, put, takeLatest } from "redux-saga/effects";
import { getAllMovies, Movie } from "../../services/movieService";
import { fetchMoviesRequest, fetchMoviesSuccess, fetchMoviesFailure } from "../slices/movieSlice";

// Generator types: <yielded type, return type, next type>
function* handleFetchMovies(): Generator<
  // yield effects (call, put, etc.)
  unknown,
  // return type of generator
  void,
  // type returned by `yield call(getAllMovies)`
  Movie[]
> {
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
