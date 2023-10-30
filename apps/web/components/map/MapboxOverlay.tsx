import { DataType } from "@/types/map/common";
import type {
  GroupedLayer,
  SourceProps,
} from "@/types/map/layers";
import { Layer, Source } from "react-map-gl";
import type { Layer as ZodLayer } from "@/lib/validations/layer";

export function groupBySource(
  layers: (SourceProps & ZodLayer)[]
): GroupedLayer[] {
  const groupedLayers = layers.reduce((acc, layer) => {
    const { url, data_type, data_source_name, data_reference_year, layers } =
      layer;
    const existingGroup = acc.find(
      (group) => group.url === url && group.data_type === data_type
    );
    if (existingGroup) {
      existingGroup.layers.push(layers);
    } else {
      acc.push({
        url,
        data_type,
        data_source_name,
        data_reference_year,
        layers: [layers],
      });
    }
    return acc;
  }, [] as GroupedLayer[]);
  return groupedLayers;
}

export default function MapboxOverlay(layers: (SourceProps & ZodLayer)[]) {
  const groupedLayers = groupBySource(layers);
  const overlays = groupedLayers.map((group) => {
    const {
      url,
      data_type,
      data_source_name: _data_source_name,
      data_reference_year: _data_reference_year,
      layers,
    } = group;
    if (data_type === DataType.mvt) {
      return (
        <Source key={url} type="vector" tiles={[url]}>
          {layers.map((layer) => (
            <Layer key={layer.id} {...layer.style} id={layer.id} />
          ))}
        </Source>
      );
    } else if (data_type === DataType.geojson) {
      return (
        <Source key={url} type="geojson" data={url}>
          {layers.map((layer) => (
            <Layer key={layer.id} {...layer.style} id={layer.id} />
          ))}
        </Source>
      );
    } else {
      return null;
    }
  });
  return <>{overlays}</>;
}
