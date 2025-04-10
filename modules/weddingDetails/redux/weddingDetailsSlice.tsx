import { baseUrl } from "@/modules/shared/utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WeddingDetailsResponse {
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  location: string;
  venue: string;
  time: string;
  guest_count: number;
  dress_code: string;
}

export interface WeddingDetailsState {
  brideName: string;
  groomName: string;
  weddingDate: string;
  location: string;
  venue: string;
  time: string;
  guestCount: number;
  dressCode: string;
}

const initialState: WeddingDetailsState = {
  location: "",
  time: "",
  guestCount: 150,
  dressCode: "",
  brideName: "",
  groomName: "",
  weddingDate: "",
  venue: "",
};

const API_URL = `${baseUrl}/weddingDetails/wedding-details`;

export const fetchWeddingDetails = createAsyncThunk<
  WeddingDetailsResponse,
  string,
  { rejectValue: string }
>(
  "weddingDetails/fetchWeddingDetails",
  async (token, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch wedding details");
      }

      const data = await response.json();
      dispatch(setAllWeddingDetails(data.weddingDetails[0]));
      return data.weddingDetails;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch wedding details"
      );
    }
  }
);

export const weddingDetailsSlice = createSlice({
  name: "weddingDetails",
  initialState,
  reducers: {
    updateLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    updateTime: (state, action: PayloadAction<string>) => {
      state.time = action.payload;
    },
    updateGuestCount: (state, action: PayloadAction<number>) => {
      state.guestCount = action.payload;
    },
    updateDressCode: (state, action: PayloadAction<string>) => {
      state.dressCode = action.payload;
    },
    setAllWeddingDetails: (
      state,
      action: PayloadAction<WeddingDetailsResponse>
    ) => {
      state.brideName = action.payload.bride_name;
      state.groomName = action.payload.groom_name;
      state.weddingDate = action.payload.wedding_date;
      state.location = action.payload.location;
      state.venue = action.payload.venue;
      state.time = action.payload.time;
      state.guestCount = action.payload.guest_count;
      state.dressCode = action.payload.dress_code;
    },
  },
});

export const {
  updateLocation,
  updateTime,
  updateGuestCount,
  updateDressCode,
  setAllWeddingDetails,
} = weddingDetailsSlice.actions;

export default weddingDetailsSlice.reducer;
