import type { Expression } from "./map/filtering";
import type { LayerState } from "@/lib/store/layer/slice";
import type { MapState } from "@/lib/store/map/slice";
import type { ContentState } from "@/lib/store/content/slice";

export interface IStore {
  map: MapState;
  content: ContentState;
  mapFilters: {
    filters: { [key: string]: string };
    logicalOperator: string;
    expressions: Expression[];
    layerToBeFiltered: string;
  };
  layers: LayerState;
}
