import { LoginType, RegisterType, AuthResponseType } from "../utils/types";
import { postRequest } from "../utils/api";

export const authService = {
  login: async (credentials: LoginType) => {
    try {
      return await postRequest("/auth/login", credentials);
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  },
};

export const registerService = async (
  registerInfo: RegisterType,
): Promise<AuthResponseType | null> => {
  try {
    const data: AuthResponseType = await postRequest("/register", registerInfo);
    return data;
  } catch (error) {
    console.error("Registration failed:", error);
    return null;
  }
};
