import { LoginType, RegisterType, AuthResponseType } from "../utils/types";
import { postRequest } from "../utils/api";

export const authService = {
  login: async (credentials: LoginType) => {
    const response = await postRequest<AuthResponseType>("/auth/login", credentials);
    return response;
  },
  register: async (credentials: RegisterType) => {
    return await postRequest<AuthResponseType>("/auth/signup", credentials);
  },
};
