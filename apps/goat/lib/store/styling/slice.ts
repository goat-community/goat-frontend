import type { ActionReducerMapBuilder, PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { fetchLayerData, getCollections } from "@/lib/store/styling/actions";
import type { AnyLayer } from "react-map-gl";

interface IViewState {
  latitude: number;
  longitude: number;
  zoom: number;
  min_zoom?: number;
  max_zoom?: number;
  bearing?: number;
  pitch?: number;
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

export interface Collection {
  id:string;
  title:string;
  itemType:string;
}

export type Layer = AnyLayer & {source: string} | null;


export interface IStylingState {
  initialViewState: IViewState;
  tabValue: number;
  basemaps: IBasemap[];
  activeBasemapIndex: number[];
  markers: IMarker[];
  mapLayer: Layer;
  changeIcon: null | ((src: string) => void);
  collections:Collection[] | null;
  layersSource:unknown | null;
  mapLayers:Layer[] | null;
}

const initialState: IStylingState = {
  initialViewState: {
    latitude: 49.45477212289379,
    longitude: 11.8455353,
    zoom: 6,
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
  mapLayer: {
    id: "clusters",
    type: "circle",
    source: "composite",
    "source-layer": "default",
    paint: {
      "circle-color": "#51bbd6",
      "circle-radius": 5,
    },
  },
  changeIcon: null,
  collections: null,
  layersSource: null,
  mapLayers: null,
};

const stylingSlice = createSlice({
  name: "styling",
  initialState,
  reducers: {
    setIcon: (state, action: PayloadAction<(src: string) => void>) => {
      state.changeIcon = action.payload
    },
    setTabValue: (state, action: PayloadAction<number>) => {
      state.tabValue = action.payload;
    },
    setActiveLayer:(state,action:PayloadAction<string | undefined>)=>{
      const layer = state.mapLayers?.filter((layer)=> layer?.id===action.payload);
      if(layer?.length){
        state.mapLayer = layer[0]
      }
    },
    setActiveBasemapIndex: (state, action: PayloadAction<number[]>) => {
      state.activeBasemapIndex = action.payload;
    },
    addMarker: (state, action: PayloadAction<IMarker>) => {
      state.markers.push(action.payload);
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
      const mapLayer = state.mapLayer as Layer;

      if (mapLayer) {
        mapLayer.paint = mapLayer.paint ?? {};
        mapLayer.paint[action.payload.key] = action.payload.val;
      }
    },
    setLayerLineWidth: (
      state,
      action: PayloadAction<{ key: string; val: number }>,
    ) => {
      const mapLayer = state.mapLayer as Layer;

      if (mapLayer) {
        mapLayer.paint = mapLayer.paint ?? {};
        mapLayer.paint[action.payload.key] = action.payload.val;
      }
    },
    setLayerFillOutLineColor: (state, action: PayloadAction<string>) => {
      const mapLayer = state.mapLayer as Layer;

      if (mapLayer?.paint) {
        mapLayer.paint["fill-outline-color"] = action.payload;
      }
    },
    deleteLayerFillOutLineColor: (state) => {
      const mapLayer = state.mapLayer as Layer;

      if (mapLayer?.paint) {
        if ("fill-outline-color" in mapLayer.paint) {
          delete mapLayer.paint["fill-outline-color"];
        }
      }
    },
    setLayerSymbolSize: (
      state,
      action: PayloadAction<{ val: number }>,
    ) => {
      const mapLayer = state.mapLayer as Layer;

      if (mapLayer) {
        mapLayer.layout = mapLayer.layout ?? {};
        mapLayer.layout['icon-size'] = action.payload.val;
      }
    },
    setIconFillColor: (state, action: PayloadAction<string>) => {
      const mapLayer = state.mapLayer as Layer;

      if (mapLayer?.paint) {
        mapLayer.paint["icon-color"] = action.payload;
      }
    }
    // setLayerIconImage: (state, action: PayloadAction<string>) => {
    //   state.mapLayer.layers[0].layout["icon-image"] = action.payload;
    // },
    // setLayerIconSize: (state, action: PayloadAction<number>) => {
    //   state.mapLayer.layers[0].layout["icon-size"] = action.payload;
    // },
  },
  extraReducers: (builder:ActionReducerMapBuilder<IStylingState>) => {
    builder.addCase(fetchLayerData.pending, (state) => {
      state.layersSource = null;
    });
    builder.addCase(fetchLayerData.fulfilled, (state, { payload }) => {
      state.layersSource = payload.sources;
      state.mapLayers= payload.layers;
    });
    builder.addCase(fetchLayerData.rejected, (state) => {
      state.layersSource = null;
    });
    builder.addCase(getCollections.pending, (state) => {
      state.collections = null;
    });
    builder.addCase(getCollections.fulfilled, (state, { payload }) => {
      state.collections = payload;
    });
    builder.addCase(getCollections.rejected, (state) => {
      state.collections = null;
    });
  },
});

export const {
  setIconFillColor,
  setIcon,
  setTabValue,
  setActiveBasemapIndex,
  addMarker,
  setLayerFillColor,
  setLayerFillOutLineColor,
  saveStyles,
  setActiveLayer,
  setLayerLineWidth,
  deleteLayerFillOutLineColor,
  setLayerSymbolSize,
} = stylingSlice.actions;

export const stylingReducer = stylingSlice.reducer;
