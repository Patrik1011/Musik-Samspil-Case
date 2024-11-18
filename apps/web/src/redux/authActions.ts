import { AppDispatch } from "./store";
import { authService } from "../services/AuthService.ts";
import { login, logout } from "./authSlice.ts";

export const loginUser =
  (credentials: { email: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await authService.login(credentials);
      console.log("Response from authService.login:", response);
      if (response && response.accessToken) {
        dispatch(login(response.accessToken));
        localStorage.setItem("token", response.accessToken);
      } else {
        console.error("Login failed: Token not found in response");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

export const logoutUser = () => (dispatch: AppDispatch) => {
  dispatch(logout());
};
