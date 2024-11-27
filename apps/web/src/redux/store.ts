import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./authSlice.ts";
import { isTokenValid } from "../utils/token.ts";

const token = localStorage.getItem("token");

const initialState = {
  auth: {
    isAuthenticated: token && isTokenValid(token) ? true : false,
    isOnBoarded: false,
    accessToken: token || null,
    user: null,
  },
};

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
  },
  preloadedState: initialState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
