export interface Basemap {
  value: string;
  url: string;
  title: string;
  subtitle: string;
  thumbnail: string;
}

export interface IMarker {
  id: string;
  lat: number;
  long: number;
  iconName: string;
}

export enum MapSidebarItemID {
  LAYERS = "layers",
  LEGEND = "legend",
  CHARTS = "charts",
  HELP = "help",
  PROPERTIES = "properties",
  FILTER = "filter",
  STYLE = "style",
  TOOLBOX = "toolbox",
  SCENARIO = "scenario"
}
