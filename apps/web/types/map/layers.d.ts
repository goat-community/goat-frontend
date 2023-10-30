import type { DataType } from "@/types/map/common";

export type SourceProps = {
  data_type: DataType;
  url: string;
  data_source_name: string;
  data_reference_year: number;
};

interface GroupedLayer {
  url: string;
  data_type: string;
  data_source_name: string;
  data_reference_year: number;
  layers: LayerProps[];
}
