import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTrainer: null,
  loading: false,
  error: false,
};

const userSlice = createSlice({
  name: "trainer",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    signInSuccess: (state, action) => {
      state.currentTrainer = action.payload;
      state.loading = false;
      state.error = false;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateTrainerStart: (state) => {
      state.loading = true;
      state.error = false;
    },
    updateTrainerSuccess: (state, action) => {
      state.currentTrainer = action.payload;
      state.loading = false;
      state.error = false;
    },
    updateTrainerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOut: (state) => {
        state.currentTrainer = null;
        state.loading = false;
        state.error = false;
      },
  },
});

export const {
  signInFailure,
  signInStart,
  signInSuccess,
  updateTrainerStart,
  updateTrainerSuccess,
  updateTrainerFailure,
  signOut
} = userSlice.actions;

export default userSlice.reducer;