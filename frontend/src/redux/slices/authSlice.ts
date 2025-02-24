import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export interface User {
  // _id?: string
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: boolean;
}

const initialState: AuthState = {
  token: Cookies.get("accessToken") || null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: false,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    signInSuccess: (
      state,
      action: PayloadAction<{ token: string; user: User; isAuthenticated: boolean;}>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = false;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = false;
    },
  },
});

export const { signInFailure, signInStart, signInSuccess, signOut } =
authSlice.actions;

export default authSlice.reducer;
