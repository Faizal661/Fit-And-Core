import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  loading: false,
  error: false,
};

const userSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    signInSuccess: (state, action) => {
      state.admin = action.payload;
      state.loading = false;
      state.error = false;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    signOut: (state) => {
        state.admin = null;
        state.loading = false;
        state.error = false;
      },
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  signOut
} = userSlice.actions;

export default userSlice.reducer;