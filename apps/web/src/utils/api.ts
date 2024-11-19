interface RequestBody {
  [key: string]: unknown;
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
    throw new Error(`Error from PostRequest: ${response.status} ${response.statusText}`);
  }
  console.log("response", response);
  return response.json();
};
