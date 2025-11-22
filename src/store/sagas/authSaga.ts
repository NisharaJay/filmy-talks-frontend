import { call, put, takeLatest } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import { PayloadAction } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../services/authService";
import {
  loginFailure,
  loginSuccess,
  loginRequest,
  signupFailure,
  signupSuccess,
  signupRequest,
  User,
} from "../slices/authSlice";

function* handleLogin(action: PayloadAction<{ email: string; password: string }>): SagaIterator {
  try {
    const { email, password } = action.payload;
    const response: any = yield call(loginUser, email, password);

    if (response?.success && response.token) {
      const user: User = {
        _id: response.user._id,
        fullName: response.user.fullName,
        email: response.user.email,
        token: response.token,
        favorites: response.user.favorites || [],
      };

      yield put(loginSuccess({ user }));
    } else {
      yield put(
        loginFailure({
          error: response?.message || "Invalid credentials",
        })
      );
    }
  } catch (error: any) {
    console.log("authSaga login error:", error);
    yield put(
      loginFailure({
        error: error?.message || "Login failed",
      })
    );
  }
}

function* handleSignup(action: PayloadAction<{ fullName: string; email: string; password: string }>): SagaIterator {
  try {
    const { fullName, email, password } = action.payload;
    const response: any = yield call(registerUser, fullName, email, password);

    if (response?.success) {
      yield put(signupSuccess());
      // Auto-login after successful signup
      yield put(loginRequest({ email, password }));
    } else {
      yield put(
        signupFailure({
          error: response?.message || "Signup failed",
        })
      );
    }
  } catch (error: any) {
    console.log("authSaga signup error:", error);
    yield put(
      signupFailure({
        error: error?.message || "Signup failed",
      })
    );
  }
}

export default function* authSaga(): SagaIterator {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(signupRequest.type, handleSignup);
}