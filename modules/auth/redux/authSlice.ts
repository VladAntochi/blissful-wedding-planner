import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  userId?: number;
  email?: string;
}

const initialState: AuthState = {
  userId: 6,
  email: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    updateUserId: (state, action: PayloadAction<number>) => {
      state.userId = action.payload;
    },
  },
});

export const { updateEmail, updateUserId } = authSlice.actions;

export default authSlice.reducer;
