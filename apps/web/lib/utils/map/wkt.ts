import { WKTLoader } from "@loaders.gl/wkt";
import { encodeSync, parseSync } from "@loaders.gl/core";
import { WKTWriter } from "@loaders.gl/wkt";

export function wktToGeoJSON(wkt: string) {
  const geojson = parseSync(wkt, WKTLoader);
  return geojson;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function geoJSONToWKT(geojson: any) {
  const wkt = encodeSync(geojson, WKTWriter);
  return wkt;
}
