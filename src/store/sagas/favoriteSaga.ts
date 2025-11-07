import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../../services/favoriteService";
import {
  addFavoriteRequest,
  addFavoriteSuccess,
  addFavoriteFailure,
  removeFavoriteRequest,
  removeFavoriteSuccess,
  removeFavoriteFailure,
  fetchFavoritesRequest,
  fetchFavoritesSuccess,
  fetchFavoritesFailure,
} from "../slices/favoriteSlice";
import { loginSuccess, updateUserFavorites } from "../slices/authSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "../../services/movieService";

function* fetchFavoritesSaga(): Generator<any, void, Movie[]> {
  try {
    console.log("fetchFavoritesSaga: Fetching favorites...");
    const response: Movie[] = yield call(getFavorites);
    console.log("fetchFavoritesSaga: Favorites fetched successfully", response.length);
    yield put(fetchFavoritesSuccess(response));
  } catch (error: any) {
    console.log("fetchFavoritesSaga: Error fetching favorites", error.message);
    yield put(fetchFavoritesFailure(error.message));
  }
}

// New saga to handle favorites fetch after login
function* handleLoginSuccess(): Generator<any, void, any> {
  yield put(fetchFavoritesRequest());
}

function* addFavoriteSaga(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    const response: { favorites: Movie[] } = yield call(addFavorite, action.payload);

    const ids = response.favorites.map((movie: Movie) => movie._id);

    yield put(addFavoriteSuccess(response.favorites));
    yield put(updateUserFavorites(ids));
  } catch (error: any) {
    yield put(addFavoriteFailure(error.message));
  }
}

function* removeFavoriteSaga(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    const response: { favorites: Movie[] } = yield call(removeFavorite, action.payload);
    const ids = response.favorites.map((movie: Movie) => movie._id);

    yield put(removeFavoriteSuccess(response.favorites));
    yield put(updateUserFavorites(ids));
  } catch (error: any) {
    yield put(removeFavoriteFailure(error.message));
  }
}

export default function* favoriteSaga() {
  yield takeLatest(fetchFavoritesRequest.type, fetchFavoritesSaga);
  yield takeLatest(addFavoriteRequest.type, addFavoriteSaga);
  yield takeLatest(removeFavoriteRequest.type, removeFavoriteSaga);
  yield takeEvery(loginSuccess.type, handleLoginSuccess);
}