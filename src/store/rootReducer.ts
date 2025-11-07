import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
import movieReducer from "./slices/movieSlice";
import favoriteReducer from "./slices/favoriteSlice";
import reviewReducer from "./slices/reviewSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  movie: movieReducer,
  favorite: favoriteReducer,
  review: reviewReducer,
});

export default rootReducer;