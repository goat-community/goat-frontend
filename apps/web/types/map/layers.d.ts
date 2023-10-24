import type { DataType } from "@/types/map/common";

export type SourceProps = {
  data_type: DataType;
  url: string;
  data_source_name: string;
  data_reference_year: number;
};

export type LayerProps = {
  id: string;
  name: string;
  group: string;
  description: string;
  type: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  extent: string;
  updated_by: string;
  active: boolean;
  folder_id: string;
  feature_layer_type: string;
  thumbnail_url?: string | undefined;
  style: LayerSpecification;
};

interface GroupedLayer {
  url: string;
  data_type: string;
  data_source_name: string;
  data_reference_year: number;
  layers: LayerProps[];
}

export type MapboxOverlayProps = {
  layers: (SourceProps & LayerProps)[];
};

// {
//   id: string;
//   style: Record<string, unknown>;
//   type: string;
//   size: number;
//   folder_id: string;
//   updated_at: string;
//   created_at: string;
//   data_source: string;
//   extent: string;
//   feature_layer_type: string;
//   ... 5 more ...;
//   thumbnail_url?: string | undefined;
// }[]
