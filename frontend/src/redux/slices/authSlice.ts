import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  id: string | null;
  email: string | null;
  username: string | null;
  token: string | null;
}

const initialState: AuthState = {
  id:null,
  email:null,
  username: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (
      state,
      action: PayloadAction<{id:string;email:string; username: string; token: string }>
    ) => {
      state.id = action.payload.token;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.token = action.payload.token;
    },
    logoutUser: (state) => {
      state.id = null;
      state.email = null;
      state.username = null;
      state.token = null;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
