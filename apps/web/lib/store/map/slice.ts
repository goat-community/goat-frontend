import type { Basemap } from "@/types/map/common";
import { MapSidebarItemID } from "@/types/map/common";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface MapState {
  basemaps: Basemap[];
  activeBasemap: string;
  maskLayer: string | undefined; // Toolbox mask layer
  toolboxStartingPoints: [number, number][] | undefined;
  activeLeftPanel: MapSidebarItemID | undefined;
  activeRightPanel: MapSidebarItemID | undefined;
}

const initialState = {
  basemaps: [
    {
      value: "mapbox_streets",
      url: "mapbox://styles/mapbox/streets-v12",
      title: "High Fidelity",
      subtitle: "Great for public presentations",
      thumbnail: "https://i.imgur.com/aVDMUKAm.png",
    },
    {
      value: "mapbox_satellite",
      url: "mapbox://styles/mapbox/satellite-streets-v12",
      title: "Satellite Streets",
      subtitle: "As seen from space",
      thumbnail: "https://i.imgur.com/JoMGuUOm.png",
    },
    {
      value: "mapbox_light",
      url: "mapbox://styles/mapbox/light-v11",
      title: "Light",
      subtitle: "For highlighting data overlays",
      thumbnail: "https://i.imgur.com/jHFGEEQm.png",
    },
    {
      value: "mapbox_dark",
      url: "mapbox://styles/mapbox/dark-v11",
      title: "Dark",
      subtitle: "For highlighting data overlays",
      thumbnail: "https://i.imgur.com/PaYV5Gjm.png",
    },
    {
      value: "mapbox_navigation",
      url: "mapbox://styles/mapbox/navigation-day-v1",
      title: "Traffic",
      subtitle: "Live traffic data",
      thumbnail: "https://i.imgur.com/lfcARxZm.png",
    },
  ],
  maskLayer: undefined,
  activeBasemap: "mapbox_streets",
  activeLeftPanel: MapSidebarItemID.LAYERS,
  toolboxStartingPoints: undefined,
  activeRightPanel: undefined,
} as MapState;

const mapSlice = createSlice({
  name: "map",
  initialState: initialState,
  reducers: {
    setActiveBasemap: (state, action: PayloadAction<string>) => {
      state.activeBasemap = action.payload;
    },
    setActiveLeftPanel: (
      state,
      action: PayloadAction<MapSidebarItemID | undefined>,
    ) => {
      state.activeLeftPanel = action.payload;
    },
    setActiveRightPanel: (
      state,
      action: PayloadAction<MapSidebarItemID | undefined>,
    ) => {
      if (state.activeRightPanel === MapSidebarItemID.TOOLBOX) {
        state.maskLayer = undefined;
        state.toolboxStartingPoints = undefined;
      }
      state.activeRightPanel = action.payload;
    },
    setMaskLayer: (state, action: PayloadAction<string | undefined>) => {
      state.maskLayer = action.payload;
    },
    setToolboxStartingPoints: (
      state,
      action: PayloadAction<[number, number][] | undefined>,
    ) => {
      if (state.toolboxStartingPoints === undefined) {
        state.toolboxStartingPoints = action.payload;
      } else {
        if (action.payload === undefined) {
          state.toolboxStartingPoints = undefined;
        } else {
          state.toolboxStartingPoints = [
            ...state.toolboxStartingPoints,
            ...action.payload,
          ];
        }
      }
    },
  },
});

export const {
  setActiveBasemap,
  setActiveLeftPanel,
  setActiveRightPanel,
  setMaskLayer,
  setToolboxStartingPoints,
} = mapSlice.actions;

export const mapReducer = mapSlice.reducer;
