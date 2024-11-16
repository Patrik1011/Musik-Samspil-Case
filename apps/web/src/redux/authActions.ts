import { AppDispatch } from "./store";
import { authService } from "../services/AuthService.ts";
import { login } from "./authSlice.ts";

export const loginUser =
  (credentials: { email: string; password: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await authService.login(credentials);
      console.log("Response from authService.login:", response);
      if (response.data && response.data.token) {
        dispatch(login(response.data.token));
        localStorage.setItem("token", response.data.token);
      } else {
        console.error("Login failed: Token not found in response");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
