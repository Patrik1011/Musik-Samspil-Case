import { jwtDecode } from "jwt-decode";
import store from "../redux/store.ts";
import { logout } from "../redux/authSlice.ts";

interface TokenPayload {
  exp: number;
}

export const isTokenValid = (token: string): boolean => {
  try {
    const { exp } = jwtDecode<TokenPayload>(token);
    return exp * 1000 > Date.now();
  } catch (error) {
    console.error("Error in isTokenValid:", error);
    return false;
  }
};

export const checkSession = () => {
  const state = store.getState();
  const token = state.auth.accessToken;

  if (token && !isTokenValid(token)) {
    store.dispatch(logout());
  }
};
