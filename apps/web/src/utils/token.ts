import { jwtDecode } from "jwt-decode";

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
