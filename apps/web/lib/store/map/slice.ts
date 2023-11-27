import type { Basemap, MapSidebarItemID } from "@/types/map/common";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface MapState {
  basemaps: Basemap[];
  activeBasemap: string;
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
      subtitle: "For highlitghting data overlays",
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
  activeBasemap: "mapbox_streets",
  activeLeftPanel: undefined,
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
      state.activeRightPanel = action.payload;
    },
  },
});

export const { setActiveBasemap, setActiveLeftPanel, setActiveRightPanel } =
  mapSlice.actions;

export const mapReducer = mapSlice.reducer;
