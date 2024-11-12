import { LoginType, RegisterType, AuthResponseType } from '../utils/types';
import { postRequest } from '../utils/api';

export const loginService = async (loginInfo: LoginType): Promise<AuthResponseType | null> => {
  try {
    const data: AuthResponseType = await postRequest('/login', loginInfo);
    return data;
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

export const registerService = async (registerInfo: RegisterType): Promise<AuthResponseType | null> => {
  try {
    const data: AuthResponseType = await postRequest('/register', registerInfo);
    return data;
  } catch (error) {
    console.error("Registration failed:", error);
    return null;
  }
};
