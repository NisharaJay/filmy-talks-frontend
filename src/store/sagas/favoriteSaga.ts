import { call, put, takeLatest, takeEvery, select } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
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

// Selector to get token
const getToken = (state: any) => state.auth.user?.token;

function* fetchFavoritesSaga(): SagaIterator {
  try {
    const token: string = yield select(getToken);
    const response = yield call(getFavorites, token);
    yield put(fetchFavoritesSuccess(response));
  } catch (error: any) {
    yield put(fetchFavoritesFailure(error.message));
  }
}

function* addFavoriteSaga(action: any): SagaIterator {
  try {
    const token: string = yield select(getToken);
    const response = yield call(addFavorite, action.payload, token);
    const ids = response.favorites.map((movie: any) => movie._id);
    yield put(addFavoriteSuccess(response.favorites));
    yield put(updateUserFavorites(ids));
  } catch (error: any) {
    yield put(addFavoriteFailure(error.message));
  }
}

function* removeFavoriteSaga(action: any): SagaIterator {
  try {
    const token: string = yield select(getToken);
    const response = yield call(removeFavorite, action.payload, token);
    const ids = response.favorites.map((movie: any) => movie._id);
    yield put(removeFavoriteSuccess(response.favorites));
    yield put(updateUserFavorites(ids));
  } catch (error: any) {
    yield put(removeFavoriteFailure(error.message));
  }
}

function* handleLoginSuccess(): SagaIterator {
  yield put(fetchFavoritesRequest());
}

export default function* favoriteSaga(): SagaIterator {
  yield takeLatest(fetchFavoritesRequest.type, fetchFavoritesSaga);
  yield takeLatest(addFavoriteRequest.type, addFavoriteSaga);
  yield takeLatest(removeFavoriteRequest.type, removeFavoriteSaga);
  yield takeEvery(loginSuccess.type, handleLoginSuccess);
}