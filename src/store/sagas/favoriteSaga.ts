import { call, put, takeLatest } from "redux-saga/effects";
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
import { PayloadAction } from "@reduxjs/toolkit";
import { Movie } from "../../services/movieService";

function* fetchFavoritesSaga(): Generator<any, void, Movie[]> {
  try {
    const response: Movie[] = yield call(getFavorites);
    yield put(fetchFavoritesSuccess(response));
  } catch (error: any) {
    yield put(fetchFavoritesFailure(error.message));
  }
}

function* addFavoriteSaga(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    const response: { favorites: Movie[] } = yield call(addFavorite, action.payload);
    yield put(addFavoriteSuccess(response.favorites));
  } catch (error: any) {
    yield put(addFavoriteFailure(error.message));
  }
}

function* removeFavoriteSaga(action: PayloadAction<string>): Generator<any, void, any> {
  try {
    const response: { favorites: Movie[] } = yield call(removeFavorite, action.payload);
    yield put(removeFavoriteSuccess(response.favorites));
  } catch (error: any) {
    yield put(removeFavoriteFailure(error.message));
  }
}

export default function* favoriteSaga() {
  yield takeLatest(fetchFavoritesRequest.type, fetchFavoritesSaga);
  yield takeLatest(addFavoriteRequest.type, addFavoriteSaga);
  yield takeLatest(removeFavoriteRequest.type, removeFavoriteSaga);
}