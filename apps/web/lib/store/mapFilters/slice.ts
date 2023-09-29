import { createSlice } from "@reduxjs/toolkit";
import type { EmptyObject, PayloadAction } from "@reduxjs/toolkit";
import type { Expression } from "@/types/map/filtering";
import { v4 } from "uuid";

interface FilterState {
  filters: { [key: string]: string } | EmptyObject;
  logicalOperator: string;
  expressions: Expression[];
}

const initialState = {
  filters: {},
  logicalOperator: "",
  expressions: [],
} as FilterState;

const filterSlice = createSlice({
  name: "map-filters",
  initialState: initialState,
  reducers: {
    setLogicalOperator(state, action: PayloadAction<string>) {
      state.logicalOperator = action.payload;
    },
    setFilters(
      state,
      action: PayloadAction<{ [key: string]: string } | object>,
    ) {
      state.filters = action.payload;
    },
    addFilter(
      state,
      action: PayloadAction<{ query: string; expression: string }>,
    ) {
      state.filters[action.payload.expression] = action.payload.query;
    },
    removeFilter(state, action: PayloadAction<string>) {
      const filters = state.filters;
      delete filters[action.payload];
    },
    addExpression(state, action: PayloadAction<Expression>) {
      const existingExpression = state.expressions.find(
        (expr) => expr.id === action.payload.id,
      );

      if (existingExpression) {
        state.expressions = state.expressions.map((expression) =>
          expression.id === action.payload.id ? action.payload : expression,
        );
      } else {
        state.expressions = [...state.expressions, action.payload];
      }
    },
    clearExpression(state) {
      state.expressions = [];
    },
    setExpression(state, action: PayloadAction<Expression[]>) {
      state.expressions = action.payload;
    },
    getExpressionById(state, action: PayloadAction<string>) {
      state.expressions.find((expr) => expr.id === action.payload);
    },
    removeExpressionById(state, action: PayloadAction<string>) {
      state.expressions = state.expressions.filter(
        (expression) => expression.id !== action.payload,
      );
    },
    duplicateExpression(state, action: PayloadAction<string>){
      const elementToClone = {...state.expressions.filter((expression) => expression.id === action.payload)[0]};
      
      elementToClone.id = v4();

      state.expressions = [...state.expressions, elementToClone];

      const filterToClone = state.filters[action.payload];

      state.filters[action.payload] = filterToClone;
    }
  },
});

export const {
  setLogicalOperator,
  setFilters,
  addFilter,
  addExpression,
  clearExpression,
  setExpression,
  removeFilter,
  removeExpressionById,
  duplicateExpression
} = filterSlice.actions;

export const filtersReducer = filterSlice.reducer;
