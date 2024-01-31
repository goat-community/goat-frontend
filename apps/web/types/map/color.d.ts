import type { RGBColor } from "@/lib/constants/color";
import type { MouseEvent } from "react";
import type { ColorRange } from "@/lib/validations/layer";
import type { ClassBreaks } from "@/lib/validations/layer";
import type { LayerFieldType } from "@/lib/validations/layer";

export type SingleColorSelectorProps = {
  onSelectColor: (color: RGBColor | ColorRange, e?: MouseEvent) => void;
  selectedColor: string;
};

export type ColorScaleSelectorProps = {
  selectedColorScaleMethod?: ClassBreaks;
  classBreaksValues?: LayerClassBreaks;
  setSelectedColorScaleMethod: (colorScale: ClassBreaks) => void;
  colorSet: ColorSet;
  label?: string;
  tooltip?: string;
  activeLayerId: string;
  activeLayerField: LayerFieldType;
  intervals: number;
};

export type ColorMap = [string[] | string | number | null, HexColor][];
// Key is HexColor but as key we can use only string
export type ColorLegends = { [key: string]: string };

export type ColorSet = {
  selectedColor: RGBColor | RGBAColor | ColorRange;
  setColor: (v: RGBColor | RGBAColor | ColorRange) => void;
  isRange?: boolean;
  label?: string;
};

export type RGBColor = [number, number, number];
export type RGBAColor = [number, number, number, number];
export type HexColor = string;

export type ColorItem = {
  id: string;
  color: string;
};

export type ColorMapItem = ColorItem & {
  value: string | string[];
};
