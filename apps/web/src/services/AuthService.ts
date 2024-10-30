interface LoginInfo {
    username: string;
    password: string;
  }
  
  interface RegisterInfo {
    username: string;
    password: string;
    email: string;
  }
  
  interface AuthResponse {
    token: string;
    user: any;
  }
  
  const API_URL = "https://example.com/api";

const headers = {
  "Content-Type": "application/json",
};

// Login function
export const login = async (loginInfo: LoginInfo): Promise<AuthResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers,
      body: JSON.stringify(loginInfo),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data: AuthResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

// Register function
export const register = async (registerInfo: RegisterInfo): Promise<AuthResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers,
      body: JSON.stringify(registerInfo),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data: AuthResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Registration failed:", error);
    return null;
  }
};
