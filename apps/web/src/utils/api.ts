const API_URL = "localhost:3000";

const headers = {
  "Content-Type": "application/json",
};

export const postRequest = async <T>(endpoint: string, body: T) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
