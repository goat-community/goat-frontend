import LayerFieldSelector from "@/components/map/panels/style/classification/LayerFieldSelector";
import OptionsCollapse from "@/components/map/panels/style/other/OptionsCollapse";
import SliderInput from "@/components/map/panels/style/other/SliderInput";
import { useTranslation } from "@/i18n/client";
import type {
  FeatureLayerProperties,
  LayerFieldType,
} from "@/lib/validations/layer";
import { useCallback, useMemo, useState } from "react";

const SizeOptions = ({
  type,
  layerStyle,
  active,
  collapsed,
  onStyleChange,
  selectedField,
  layerFields,
}: {
  type: "stroke_width" | "radius" | "marker_size";
  layerStyle?: FeatureLayerProperties;
  active: boolean;
  collapsed?: boolean;
  onStyleChange?: (newStyle: FeatureLayerProperties) => void;
  selectedField?: LayerFieldType;
  layerFields: LayerFieldType[];
}) => {
  const { t } = useTranslation(["maps", "common"]);

  const [value, setValue] = useState(
    layerStyle?.[`${type}_field`]
      ? layerStyle?.[`${type}_range`] || [0, 50]
      : layerStyle?.[`${type}`] || 0,
  );

  const isRange = useMemo(
    () => (layerStyle?.[`${type}_field`] ? true : false),
    [layerStyle, type],
  );

  const _onStyleChange = useCallback(
    (value) => {
      const newStyle = JSON.parse(JSON.stringify(layerStyle)) || {};
      if (isRange) {
        newStyle[`${type}_range`] = value;
      } else {
        newStyle[`${type}`] = value;
      }
      onStyleChange && onStyleChange(newStyle);
    },
    [layerStyle, isRange, type, onStyleChange],
  );

  return (
    <>
      <OptionsCollapse
        active={!!active}
        collapsed={collapsed}
        baseOptions={
          <SliderInput
            value={value}
            onChange={setValue}
            onChangeCommitted={_onStyleChange}
            isRange={isRange}
            rootSx={{
              pl: 3,
              pr: 2,
            }}
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
                if (onStyleChange) {
                  onStyleChange(newStyle);
                }
              }}
              label={t(`maps:${type}_based_on`)}
              tooltip={t(`maps:${type}_based_on_desc`)}
            />
          </>
        }
      />
    </>
  );
};

export default SizeOptions;
