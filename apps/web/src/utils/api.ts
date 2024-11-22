import { getToken } from "../redux/authSlice.ts";
import store from "../redux/store.ts";

interface RequestBody {
  [key: string]: unknown;
}

interface CustomError extends Error {
  response?: Response;
}

const API_URL = "http://localhost:3000";

const headers = {
  "Content-Type": "application/json",
};

export const postRequest = async <T>(endpoint: string, body: RequestBody): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = new Error(
      `Error from PostRequest: ${response.status} ${response.statusText}`,
    ) as CustomError;
    error.response = response;
    throw error;
  }
  return response.json();
};

export const getRequest = async <T>(endpoint: string): Promise<T> => {
  const token = getToken(store.getState());
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      console.warn(`resource not found: ${endpoint}`);
      return null as unknown as T;
    }
    const error = new Error(
      `Error from GetRequest: ${response.status} ${response.statusText}`,
    ) as CustomError;
    error.response = response;
    throw error;
  }
  return response.json();
};
