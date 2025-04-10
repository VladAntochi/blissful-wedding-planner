import { baseUrl } from "@/modules/shared/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import uuid from "react-native-uuid";

export interface Guest {
  id: string;
  name: string;
  email: string;
  status: "invited" | "accepted" | "declined";
}

export interface GuestsState {
  guests: Guest[];
}

const initialState: GuestsState = {
  guests: [],
};

const API_URL = `${baseUrl}/guests`;

export const createGuest = createAsyncThunk<
  Guest,
  {
    name: string;
    email: string;
    status: "invited" | "accepted" | "declined";
    token: string;
  }, // Argument types
  { rejectValue: string } // Type of the error message returned on rejection
>(
  "guests/addGuest",
  async ({ name, email, status, token }, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${API_URL}/add-guest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add guest");
      }

      const data = await response.json();
      dispatch(
        addGuest({
          id: data.guest.id,
          name: data.guest.name,
          email: data.guest.email,
          status: data.guest.status,
        })
      );
      return data.guest;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add guest");
    }
  }
);

export const fetchGuests = createAsyncThunk<
  Guest[], // Return type: Array of Guests
  string, // Argument type: The token for authentication
  { rejectValue: string } // Type of error message returned on rejection
>("guests/fetchGuests", async (token, { rejectWithValue, dispatch }) => {
  try {
    const response = await fetch(`${API_URL}/guests`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Response:", response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch guests");
    }

    const data = await response.json();
    console.log("Fetched guests:", data.guests);
    dispatch(setAllGuests(data.guests));
    return data.guests; // Return the array of guests
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch guests");
  }
});

export const guestsSlice = createSlice({
  name: "guests",
  initialState,
  reducers: {
    addGuest: (state, action) => {
      state.guests.push({
        id: uuid.v4().toString(),
        ...action.payload,
        status: "invited",
      });
    },
    removeGuest: (state, action) => {
      state.guests = state.guests.filter(
        (guest) => guest.id !== action.payload
      );
    },
    updateGuestStatus: (state, action) => {
      const { id, status } = action.payload;
      const guest = state.guests.find((guest) => guest.id === id);
      if (guest) {
        guest.status = status;
      }
    },
    setAllGuests: (state, action) => {
      state.guests = action.payload;
    },
  },
});

export const { addGuest, removeGuest, updateGuestStatus, setAllGuests } =
  guestsSlice.actions;
