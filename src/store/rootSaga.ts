import { all } from "redux-saga/effects";
import authSaga from "./sagas/authSaga";
import movieSaga from "./sagas/movieSaga";
import favoriteSaga from "./sagas/favoriteSaga";

export default function* rootSaga() {
  yield all([authSaga(), movieSaga(), favoriteSaga()]);
}
