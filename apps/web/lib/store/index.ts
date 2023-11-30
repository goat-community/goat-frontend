import { contentReducer } from "@/lib/store/content/slice";
import { configureStore } from "@reduxjs/toolkit";
import { layerReducer } from "./layer/slice";
import { mapReducer } from "./map/slice";

const store = configureStore({
  reducer: {
    content: contentReducer,
    layers: layerReducer,
    map: mapReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
