import { stringify } from 'safe-stable-stringify';

export const signupUser = async (formObject) => {
  const response = await fetch(`${process.env.API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: stringify(formObject)
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.message || 'Signup failed');
  }

  return response.json();
};

export const loginUser = async (formObject) => {
  const response = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: stringify(formObject)
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
};
