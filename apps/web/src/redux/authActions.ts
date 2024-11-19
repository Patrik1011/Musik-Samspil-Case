import { AppDispatch } from "./store";
import { authService } from "../services/AuthService.ts";
import { login, logout } from "./authSlice.ts";

export const loginUser =
  (credentials: { email: string; password: string }) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const response = await authService.login(credentials);

      if (!response?.accessToken) {
        throw new Error("Invalid email or password");
      }

      dispatch(login(response.accessToken));
      localStorage.setItem("token", response.accessToken);
    } catch (error: unknown) {
      let errorMessage = "Login failed";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Error in loginUser:", errorMessage);
      throw new Error(errorMessage);
    }
  };

export const logoutUser = () => (dispatch: AppDispatch) => {
  dispatch(logout());
};
