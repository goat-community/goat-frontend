import { useTranslation } from "@/i18n/client";
import ColorSelector from "@/components/map/panels/style/color/ColorSelector";
import type {
  FeatureLayerProperties,
  LayerFieldType,
} from "@/lib/validations/layer";
import { useMemo } from "react";
import LayerFieldSelector from "@/components/map/panels/style/classification/LayerFieldSelector";
import ColorScaleSelector from "@/components/map/panels/style/classification/ColorScaleSelector";
import OptionsCollapse from "@/components/map/panels/style/other/OptionsCollapse";

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

  return (
    <OptionsCollapse
      active={!!active}
      baseOptions={
        <ColorSelector
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
                intervals={layerStyle?.[`${type}_range`]?.colors.length}
              />
            )}
        </>
      }
      collapsed={collapsed}
    />
  );
};

export default ColorOptions;
