import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { Basemap, SelectorItem } from "@/types/map/common";
import { MapSidebarItemID } from "@/types/map/common";
import { Scenario } from "@/lib/validations/scenario";
import { MapPopoverEditorProps, MapPopoverInfoProps } from "@/types/map/popover";
import { MapGeoJSONFeature } from "react-map-gl";

export interface MapState {
  basemaps: Basemap[];
  activeBasemap: string;
  maskLayer: string | undefined; // Toolbox mask layer
  toolboxStartingPoints: [number, number][] | undefined;
  activeLeftPanel: MapSidebarItemID | undefined;
  activeRightPanel: MapSidebarItemID | undefined;
  isMapGetInfoActive: boolean;
  mapCursor: string | undefined; // Toolbox features will override this. If undefined, the map will use the default cursor with pointer on hover
  editingScenario: Scenario | undefined;
  selectedScenarioLayer: SelectorItem | undefined;
  highlightedFeature: MapGeoJSONFeature | undefined;
  popupInfo: MapPopoverInfoProps | undefined;
  popupEditor: MapPopoverEditorProps | undefined;
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
  isMapGetInfoActive: true,
  mapCursor: undefined,
  editingScenario: undefined,
  selectedScenarioLayer: undefined,
  popupInfo: undefined,
  popupEditor: undefined,
  highlightedFeature: undefined,
} as MapState;

const mapSlice = createSlice({
  name: "map",
  initialState: initialState,
  reducers: {
    setActiveBasemap: (state, action: PayloadAction<string>) => {
      state.activeBasemap = action.payload;
    },
    setActiveLeftPanel: (state, action: PayloadAction<MapSidebarItemID | undefined>) => {
      state.activeLeftPanel = action.payload;
    },
    setActiveRightPanel: (state, action: PayloadAction<MapSidebarItemID | undefined>) => {
      if (state.activeRightPanel === MapSidebarItemID.TOOLBOX) {
        state.maskLayer = undefined;
        state.toolboxStartingPoints = undefined;
        state.mapCursor = undefined;
      }
      if (state.activeRightPanel === MapSidebarItemID.SCENARIO) {
        state.editingScenario = undefined;
        state.selectedScenarioLayer = undefined;
      }
      state.activeRightPanel = action.payload;
    },
    setMaskLayer: (state, action: PayloadAction<string | undefined>) => {
      state.maskLayer = action.payload;
    },
    setToolboxStartingPoints: (state, action: PayloadAction<[number, number][] | undefined>) => {
      if (state.toolboxStartingPoints === undefined) {
        state.toolboxStartingPoints = action.payload;
      } else {
        if (action.payload === undefined) {
          state.toolboxStartingPoints = undefined;
        } else {
          state.toolboxStartingPoints = [...state.toolboxStartingPoints, ...action.payload];
        }
      }
    },
    setIsMapGetInfoActive: (state, action: PayloadAction<boolean>) => {
      state.isMapGetInfoActive = action.payload;
      if (action.payload === false) {
        state.popupInfo = undefined;
        state.highlightedFeature = undefined;
      }
    },
    setMapCursor: (state, action: PayloadAction<string | undefined>) => {
      state.mapCursor = action.payload;
    },
    setEditingScenario: (state, action: PayloadAction<Scenario | undefined>) => {
      state.editingScenario = action
        .payload;
      if (action.payload === undefined) {
        state.selectedScenarioLayer = undefined;
      }
    },
    setSelectedScenarioLayer: (state, action: PayloadAction<SelectorItem | undefined>) => {
      state.selectedScenarioLayer = action.payload;
    },
    setPopupInfo: (state, action: PayloadAction<MapPopoverInfoProps | undefined>) => {
      state.popupInfo = action.payload;
    },
    setPopupEditor: (state, action) => {
      state.popupEditor = action.payload;
    },
    setHighlightedFeature: (state, action) => {
      state.highlightedFeature = action
        .payload;
    }
  },
});

export const {
  setActiveBasemap,
  setActiveLeftPanel,
  setActiveRightPanel,
  setMaskLayer,
  setToolboxStartingPoints,
  setIsMapGetInfoActive,
  setMapCursor,
  setEditingScenario,
  setSelectedScenarioLayer,
  setPopupInfo,
  setPopupEditor,
  setHighlightedFeature
} = mapSlice.actions;

export const mapReducer = mapSlice.reducer;
