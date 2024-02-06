import { useTranslation } from "@/i18n/client";
import ColorSelector from "@/components/map/panels/style/color/ColorSelector";
import type {
  ColorRange,
  FeatureLayerProperties,
  LayerFieldType,
} from "@/lib/validations/layer";
import { useMemo, useState } from "react";
import LayerFieldSelector from "@/components/map/panels/style/classification/LayerFieldSelector";
import ColorScaleSelector from "@/components/map/panels/style/classification/ColorScaleSelector";
import OptionsCollapse from "@/components/map/panels/style/other/OptionsCollapse";
import SliderInput from "@/components/map/panels/style/other/SliderInput";
import FormLabelHelper from "@/components/common/FormLabelHelper";

const ColorOptions = ({
  type,
  layerStyle,
  layerId,
  active,
  layerFields,
  selectedField,
  collapsed,
  onStyleChange,
}: {
  type: "color" | "stroke_color";
  layerStyle?: FeatureLayerProperties;
  layerId: string;
  active: boolean;
  selectedField?: LayerFieldType;
  layerFields: LayerFieldType[];
  collapsed?: boolean;
  onStyleChange?: (newStyle: FeatureLayerProperties) => void;
}) => {
  const { t } = useTranslation(["maps", "common"]);

  const colorSet = useMemo(
    () => ({
      selectedColor: layerStyle?.[`${type}_field`]
        ? layerStyle?.[`${type}_range`]
        : layerStyle?.[`${type}`],
      isRange: layerStyle?.[`${type}_field`] ? true : false,
      setColor: (color) => {
        const newStyle = JSON.parse(JSON.stringify(layerStyle)) || {};
        if (layerStyle?.[`${type}_field`]) {
          newStyle[`${type}_range`] = color;
        } else {
          newStyle[`${type}`] = color;
        }
        onStyleChange && onStyleChange(newStyle);
      },
    }),
    [layerStyle, onStyleChange, type],
  );
  const [opacity, setOpacity] = useState(layerStyle?.opacity || 1);

  return (
    <OptionsCollapse
      active={!!active}
      baseOptions={
        <ColorSelector
          scaleType={layerStyle?.[`${type}_scale`]}
          colorSet={colorSet}
          label={
            layerStyle?.[`${type}_field`] ? t("maps:palette") : t("maps:color")
          }
        />
      }
      advancedOptions={
        <>
          <LayerFieldSelector
            fields={layerFields}
            selectedField={selectedField}
            setSelectedField={(field) => {
              const newStyle = JSON.parse(JSON.stringify(layerStyle)) || {};
              newStyle[`${type}_field`] = field;
              if (field?.type === "string") {
                newStyle[`${type}_scale`] = "ordinal";
              }
              if (
                field?.type === "number" &&
                layerStyle?.[`${type}_scale`] == "ordinal"
              ) {
                newStyle[`${type}_scale`] = "quantile";
              }
              if (onStyleChange) {
                onStyleChange(newStyle);
              }
            }}
            label={t("maps:color_based_on")}
            tooltip={t("maps:color_based_on_desc")}
          />
          {layerStyle?.[`${type}_field`] &&
            Array.isArray(layerStyle?.[`${type}_range`]?.colors) && (
              <ColorScaleSelector
                colorSet={colorSet}
                selectedColorScaleMethod={
                  layerStyle?.[`${type}_scale`] || "quantile"
                }
                classBreaksValues={layerStyle?.[`${type}_scale_breaks`]}
                setSelectedColorScaleMethod={(colorScale) => {
                  const newStyle = JSON.parse(JSON.stringify(layerStyle)) || {};
                  newStyle[`${type}_scale`] = colorScale;
                  onStyleChange && onStyleChange(newStyle);
                }}
                label={t("maps:color_scale")}
                activeLayerId={layerId}
                activeLayerField={
                  layerStyle[`${type}_field`] || { name: "", type: "string" }
                }
                onCustomOrdinalApply={(colorMaps) => {
                  const newStyle = JSON.parse(JSON.stringify(layerStyle)) || {};
                  const colorRange = newStyle[`${type}_range`] as ColorRange;
                  colorRange.name = "Custom";
                  colorRange.category = "Custom";
                  colorRange.color_map = colorMaps;
                  // We have to overwrite the color range colors with the new ones from the colorMaps.
                  // This are considered custom colors.
                  colorRange.colors = colorMaps.map((colorMap) => colorMap[1]);
                  colorRange.type = "custom";
                  onStyleChange && onStyleChange(newStyle);
                }}
                intervals={layerStyle?.[`${type}_range`]?.colors.length}
              />
            )}
          {type === "color" && (
            <>
              <FormLabelHelper label={t("maps:opacity")} color="inherit" />
              <SliderInput
                value={opacity}
                isRange={false}
                rootSx={{
                  pl: 1,
                  pt: 0,
                  "&&": {
                    mt: 0,
                  },
                }}
                min={0}
                max={1}
                step={0.01}
                onChange={(value) => {
                  setOpacity(value as number);
                }}
                onChangeCommitted={(value) => {
                  const newStyle = JSON.parse(JSON.stringify(layerStyle)) || {};
                  newStyle.opacity = value as number;
                  onStyleChange && onStyleChange(newStyle);
                }}
              />
            </>
          )}
        </>
      }
      collapsed={collapsed}
    />
  );
};

export default ColorOptions;
