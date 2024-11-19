import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./authSlice.ts";
import { login } from "./authSlice.ts";
import { isTokenValid } from "../utils/token.ts";

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
  },
});

const token = localStorage.getItem("token");
if (token && isTokenValid(token)) {
  store.dispatch(login(token));
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
