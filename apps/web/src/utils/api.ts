const API_URL = "http://localhost:3000";

const headers = {
  "Content-Type": "application/json",
};

export const postRequest = async (endpoint: string, body: any) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  const responseData = await response.json();
  console.log("Response data:", responseData);
  return responseData;
};
