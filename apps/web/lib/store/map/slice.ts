import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface MapState {
  loading: boolean;
}

const initialState = {
  loading: false,
} as MapState;

const mapSlice = createSlice({
  name: "map",
  initialState: initialState,
  reducers: {
    setMapLoading(
      state,
      action: PayloadAction<boolean>,
    ) {
      state.loading = action.payload;
    }
  },
});

export const {
  setMapLoading
} = mapSlice.actions;

export const mapReducer = mapSlice.reducer;
