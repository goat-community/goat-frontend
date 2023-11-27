import type { MapRef } from "react-map-gl";

export function fitBounds(
  map: MapRef,
  bounds: [number, number, number, number]
) {
  map.fitBounds(bounds, {
    padding: 40,
    maxZoom: 18,
    duration: 1000,
  });
}
