import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});

export const { login, setUser, logout } = authSlice.actions;
export default authSlice.reducer;

// Selector
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
