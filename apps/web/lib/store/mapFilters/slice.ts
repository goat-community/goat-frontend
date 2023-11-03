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
  layerToBeFiltered: "4d76705b-9736-43a3-93df-fd14e10f6604",
} as FilterState;

const filterSlice = createSlice({
  name: "map-filters",
  initialState: initialState,
  reducers: {  },
});

export const {
} = filterSlice.actions;

export const filtersReducer = filterSlice.reducer;
