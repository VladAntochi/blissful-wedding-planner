import { RootState } from "@/redux/store";

export const selectEmail = (state: RootState) => state.auth.email;
export const selectUserId = (state: RootState) => state.auth.userId;
