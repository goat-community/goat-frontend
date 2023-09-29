import type {IStylingState} from "@/lib/store/styling/slice";
import type { Expression } from "./map/filtering";
import type { LayerState } from "@/lib/store/layer/slice";

export interface IStore {
  map: object;
  content: {
    folders: [];
    getFoldersStatus: string;
    previewMode: string;
  };
  styling: IStylingState;
  mapFilters: {
    filters: { [key: string]: string };
    logicalOperator: string;
    expressions: Expression[];
  };
  layers: LayerState;
}
