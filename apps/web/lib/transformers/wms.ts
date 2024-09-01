export const DEFAULT_VERSION = '1.3.0';


/**
 * Generates a WMS (Web Map Service) URL for fetching map tiles.
 *
 * @param {string} baseUrl - The base URL of the WMS service.
 * @param {string} layers - Comma-separated list of layer names to include in the request.
 * @param {number} [dpi=90] - Optional DPI (Dots Per Inch) for the map tiles. Defaults to 90 if not provided.
 * @param {string} [version="1.3.0"] - Optional WMS version. Defaults to "1.3.0" if not provided.
 * @returns {string} - The generated WMS URL with the specified parameters.
 */

export const generateWmsUrl = (baseUrl, layers, dpi?, version?) => {
  const width = 256;
  const height = 256;
  const _dpi = dpi || 90;
  const _version = version || DEFAULT_VERSION;
  return `${baseUrl}?bbox={bbox-epsg-3857}&service=WMS&REQUEST=GetMap&layers=${layers}&FORMAT=image/png&TRANSPARENT=true&WIDTH=${width}&HEIGHT=${height}&SRS=EPSG:3857&CRS=EPSG:3857&VERSION=${_version}&STYLES=default&DPI=${_dpi}&MAP_RESOLUTION=${_dpi}&FORMAT_OPTIONS=dpi:${_dpi}`;
};
