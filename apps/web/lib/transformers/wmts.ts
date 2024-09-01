/**
 * Converts a WMTS resource URL to a Maplibre-compatible XYZ URL.
 *
 * @param {string} resourceUrl - The WMTS resource URL template.
 * @param {string} style - The style to be used in the URL.
 * @param {string} tileMatrixSet - The tile matrix set to be used in the URL.
 * @returns {string} - The converted Maplibre-compatible URL.
 */
export const convertWmtsToXYZUrl = (resourceUrl: string, style: string, tileMatrixSet: string) => {
  return resourceUrl
    .replace("{Style}", style)
    .replace("{TileMatrixSet}", tileMatrixSet)
    .replace("{TileMatrix}", "{z}")
    .replace("{TileRow}", "{y}")
    .replace("{TileCol}", "{x}");
};


/**
 * Extracts the WMTS layers from the capabilities document.
 *
 * @param {object} capabilities - The WMTS capabilities document.
 * @returns {object[]} - The extracted WMTS layers.
 */
export const getWmtsFlatLayers = (capabilities) => {
  const datasets = capabilities?.Contents?.Layer;
  const tileMatrixSets = capabilities?.Contents?.TileMatrixSet;
  const webMercator = tileMatrixSets.find((tms) => tms.SupportedCRS.includes("EPSG:3857"));
  if (!webMercator) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options = [] as any[];
  if (datasets?.length) {
    datasets.forEach((dataset) => {
      const tileMatrixSetLink = dataset.TileMatrixSetLink.find((link) =>
        link.TileMatrixSet.includes(webMercator.Identifier)
      );
      const supportsPng = dataset.Format.includes("image/png");
      const resourceUrl = dataset.ResourceURL.find((url) => url.format.includes("image/png"));
      if (tileMatrixSetLink && supportsPng) {
        dataset.Style.forEach((style) => {
          options.push({
            Identifier: dataset.Identifier,
            ResourceURL: resourceUrl.template,
            Format: "image/png",
            TileMatrixSet: tileMatrixSetLink.TileMatrixSet,
            CRS: "EPSG:3857",
            Style: style.Identifier,
            Title: dataset.Title,
            Abstract: dataset.Abstract,
            WGS84BoundingBox: dataset.WGS84BoundingBox,
          });
        });
      }
    });
  }

  return options;
};
