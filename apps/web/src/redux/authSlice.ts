import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isOnBoarded: boolean;
  accessToken: string | null;
  user: User | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isOnBoarded: false,
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
    onBoardingStatus(state, action: PayloadAction<boolean>) {
      state.isOnBoarded = action.payload;
    },
  },
});

export const { login, setUser, logout, onBoardingStatus } = authSlice.actions;
export default authSlice.reducer;

export const getToken = (state: { auth: AuthState }) => state.auth.accessToken;
