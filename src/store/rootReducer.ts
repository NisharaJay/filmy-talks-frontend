import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
import movieReducer from "./slices/movieSlice";
import favoriteReducer from "./slices/favoriteSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  movie: movieReducer,
  favorite: favoriteReducer,
});

export default rootReducer;