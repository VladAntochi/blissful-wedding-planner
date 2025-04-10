import { RootState } from "@/redux/store";
import { WeddingDetailsState } from "./weddingDetailsSlice";

// Select the whole slice
export const selectWeddingDetails = (state: RootState): WeddingDetailsState =>
  state.weddingDetails;

// Select individual fields
export const selectLocation = (state: RootState) =>
  state.weddingDetails.location;
export const selectTime = (state: RootState) => state.weddingDetails.time;
export const selectGuestCount = (state: RootState) =>
  state.weddingDetails.guestCount;
export const selectDressCode = (state: RootState) =>
  state.weddingDetails.dressCode;
export const selectWeddingDate = (state: RootState) =>
  state.weddingDetails.weddingDate;
