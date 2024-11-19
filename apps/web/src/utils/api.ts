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
