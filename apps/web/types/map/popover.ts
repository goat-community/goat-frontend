import { ProjectLayer } from "@/lib/validations/project";
import { MapGeoJSONFeature } from "react-map-gl";


export enum EditorModes {
  DRAW = "draw",
  MODIFY_GEOMETRY = "modify_geometry",
  MODIFY_ATTRIBUTES = "modify_attributes",
  DELETE = "delete",
}

export type MapPopoverEditorProps = {
  title?: string;
  lngLat: [number, number];
  feature?: MapGeoJSONFeature | undefined;
  editMode: EditorModes;
  projectLayer: ProjectLayer;
  onClose: () => void;
  onConfirm: (payload: any) => void;
};

export type MapPopoverInfoProps = {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties: { [name: string]: any } | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  jsonProperties: { [name: string]: any } | null;
  lngLat: [number, number];
  onClose: () => void;
};

