import { getToken } from "../redux/authSlice.ts";
import store from "../redux/store.ts";

interface RequestBody {
  [key: string]: unknown;
}

interface CustomError extends Error {
  response?: Response;
}

const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = (): Record<string, string> => {
  const token = getToken(store.getState());
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      headers["Authorization"] = `Bearer ${localToken}`;
    }
  }
  return headers;
};

export const postRequest = async <T>(endpoint: string, body?: RequestBody): Promise<T> => {
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

export const patchRequest = async <T>(endpoint: string, body: RequestBody): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = new Error(
      `Error from PatchRequest: ${response.status} ${response.statusText}`,
    ) as CustomError;
    error.response = response;
    throw error;
  }
  return response.json();
};

export const deleteRequest = async (endpoint: string): Promise<void> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = new Error(
      `Error from DeleteRequest: ${response.status} ${response.statusText}`,
    ) as CustomError;
    error.response = response;
    throw error;
  }
  return response.json();
};
