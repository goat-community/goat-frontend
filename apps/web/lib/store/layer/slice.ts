import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Layer } from "@/lib/validations/layer";

export interface LayerState {
  layers: Layer[];
}

const initialState = {
  layers: [],
} as LayerState;

const layerSlice = createSlice({
  name: "layer",
  initialState: initialState,
  reducers: {
    setLayers(
      state,
      action: PayloadAction<Layer[]>,
    ) {
      state.layers = action.payload;
    },
    addLayer(
      state,
      action: PayloadAction<Layer>,
    ) {
      state.layers = [...state.layers, action.payload];
    },
    activateLayer(
      state,
      action: PayloadAction<Layer>,
    ) {
      state.layers = state.layers.map((layer)=> layer.name === action.payload.name ? {...layer, action: true} : layer)
    },
    deactivateLayer(
      state,
      action: PayloadAction<Layer>,
    ) {
      state.layers = state.layers.map((layer)=> layer.name === action.payload.name ? {...layer, action: false} : layer)
    },
  },
});

export const {
  setLayers,
  addLayer,
  activateLayer,
  deactivateLayer,
} = layerSlice.actions;

export const layerReducer = layerSlice.reducer;
