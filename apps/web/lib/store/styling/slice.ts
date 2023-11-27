import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { AnyLayer } from "react-map-gl";

interface IViewState {
  latitude: number;
  longitude: number;
  zoom: number;
  min_zoom: number;
  max_zoom: number;
  bearing: number;
  pitch: number;
}

interface IBasemap {
  value: string;
  url: string;
  title: string;
  subtitle: string;
  thumbnail: string;
}

interface IMarker {
  id: string;
  lat: number;
  long: number;
  iconName: string;
}

export type TLayer =
  | (AnyLayer & {
      sources: {
        composite: {
          url: string;
          type: string;
        };
      };
    })
  | null;

export interface IStylingState {
  initialViewState: IViewState;
  tabValue: number;
  basemaps: IBasemap[];
  activeBasemapIndex: number[];
  markers: IMarker[];
  mapLayer: unknown;
  changeIcon: null | ((src: string) => void);
}

const initialState: IStylingState = {
  initialViewState: {
    latitude: 48.13780235991851,
    longitude: 11.575936741828286,
    zoom: 11,
    min_zoom: 0,
    max_zoom: 20,
    bearing: 0,
    pitch: 0,
  },
  tabValue: 0,
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
  activeBasemapIndex: [4],
  markers: [],
  //todo need get layer from db
  mapLayer: null as TLayer,
  changeIcon: null,
};

const stylingSlice = createSlice({
  name: "styling",
  initialState,
  reducers: {
    setIcon: (state, action: PayloadAction<(src: string) => void>) => {
      state.changeIcon = action.payload;
    },
    setTabValue: (state, action: PayloadAction<number>) => {
      state.tabValue = action.payload;
    },
    setActiveBasemapIndex: (state, action: PayloadAction<number[]>) => {
      state.activeBasemapIndex = action.payload;
    },
    addMarker: (state, action: PayloadAction<IMarker>) => {
      state.markers.push(action.payload);
    },
    removeMarker : (state) => {
      state.markers = [];
    },
    editeMarkerPosition: (state, action: PayloadAction<IMarker>) => {
      state.markers = state.markers.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    },
    saveStyles: (state): void => {
      const jsonData = JSON.stringify(state, null, 2); // Convert state to JSON with pretty formatting
      console.log("Saved jsonData", jsonData);

      // const blob = new Blob([jsonData], { type: 'application/json' });
      // Need Using the FileSaver library to save the JSON data as a file
      // saveAs(blob, 'map_styles.json');
    },
    setLayerFillColor: (
      state,
      action: PayloadAction<{ key: string; val: string }>,
    ) => {
      const mapLayer = state.mapLayer as TLayer;

      if (mapLayer) {
        mapLayer.paint = mapLayer.paint ?? {};
        mapLayer.paint[action.payload.key] = action.payload.val;
      }
    },
    setLayerLineWidth: (
      state,
      action: PayloadAction<{ key: string; val: number }>,
    ) => {
      const mapLayer = state.mapLayer as TLayer;

      if (mapLayer) {
        mapLayer.paint = mapLayer.paint ?? {};
        mapLayer.paint[action.payload.key] = action.payload.val;
      }
    },
    setLayerFillOutLineColor: (state, action: PayloadAction<string>) => {
      const mapLayer = state.mapLayer as TLayer;

      if (mapLayer?.paint) {
        mapLayer.paint["fill-outline-color"] = action.payload;
      }
    },
    deleteLayerFillOutLineColor: (state) => {
      const mapLayer = state.mapLayer as TLayer;

      if (mapLayer?.paint) {
        if ("fill-outline-color" in mapLayer.paint) {
          delete mapLayer.paint["fill-outline-color"];
        }
      }
    },
    setLayerSymbolSize: (state, action: PayloadAction<{ val: number }>) => {
      const mapLayer = state.mapLayer as TLayer;

      if (mapLayer) {
        mapLayer.layout = mapLayer.layout ?? {};
        mapLayer.layout["icon-size"] = action.payload.val;
      }
    },
    setIconFillColor: (state, action: PayloadAction<string>) => {
      const mapLayer = state.mapLayer as TLayer;

      if (mapLayer?.paint) {
        mapLayer.paint["icon-color"] = action.payload;
      }
    },
  },
});

export const {
  setIconFillColor,
  setIcon,
  setTabValue,
  setActiveBasemapIndex,
  addMarker,
  removeMarker,
  setLayerFillColor,
  setLayerFillOutLineColor,
  saveStyles,
  setLayerLineWidth,
  deleteLayerFillOutLineColor,
  setLayerSymbolSize,
} = stylingSlice.actions;

export const stylingReducer = stylingSlice.reducer;
