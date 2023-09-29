import { contentReducer } from "@/lib/store/content/slice";
import { stylingReducer } from "@/lib/store/styling/slice";
import { configureStore } from "@reduxjs/toolkit";
import { filtersReducer } from "./mapFilters/slice";
import { layerReducer } from "./layer/slice";

const store = configureStore({
  reducer: {
    content: contentReducer,
    styling: stylingReducer,
    mapFilters: filtersReducer,
    layers: layerReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export default store;
