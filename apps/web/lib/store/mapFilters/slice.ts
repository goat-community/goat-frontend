import { createSlice } from "@reduxjs/toolkit";
import type { EmptyObject } from "@reduxjs/toolkit";
import type { Expression } from "@/types/map/filtering";

interface FilterState {
  filters: { [key: string]: string } | EmptyObject;
  logicalOperator: string;
  expressions: Expression[];
  layerToBeFiltered: string;
}

const initialState = {
  filters: {},
  logicalOperator: "",
  expressions: [],
  layerToBeFiltered: "ac9cdd4f-8712-459b-bfb8-3e4664c48abb",
} as FilterState;

const filterSlice = createSlice({
  name: "map-filters",
  initialState: initialState,
  reducers: {  },
});

export const {
} = filterSlice.actions;

export const filtersReducer = filterSlice.reducer;
