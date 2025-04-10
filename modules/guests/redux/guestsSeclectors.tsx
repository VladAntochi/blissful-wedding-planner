import { RootState } from "@/redux/store";
import { createSelector } from "@reduxjs/toolkit";
import { Guest } from "./guestsSlice";

export const selectGuestState = (state: RootState) => state.guests.guests;

export const selectAllConfirmedGuests = createSelector(
  [selectGuestState],
  (guests): Guest[] => guests.filter((guest) => guest.status === "accepted")
);
export const selectAllGuests = (state: RootState) => state.guests.guests;

export const selectAllDeclinedGuests = createSelector(
  (state: RootState) => state.guests.guests, // Input selector
  (guests) => guests.filter((guest) => guest.status === "declined") // Output selector
);
