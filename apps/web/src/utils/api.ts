import { store } from "../redux/store";
import { selectAccessToken } from "../redux/authSlice";

interface RequestBody {
  [key: string]: unknown;
}

interface CustomError extends Error {
  response?: Response;
}

const API_URL = "http://localhost:3000";

const getHeaders = (): Record<string, string> => {
  const token = selectAccessToken(store.getState());
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const postRequest = async <T>(endpoint: string, body: RequestBody): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: getHeaders(),
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

export const putRequest = async <T>(endpoint: string, body: RequestBody): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = new Error(
      `Error from PutRequest: ${response.status} ${response.statusText}`,
    ) as CustomError;
    error.response = response;
    throw error;
  }
  return response.json();
};

export const getRequest = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = new Error(
      `Error from GetRequest: ${response.status} ${response.statusText}`,
    ) as CustomError;
    error.response = response;
    throw error;
  }
  return response.json();
};
