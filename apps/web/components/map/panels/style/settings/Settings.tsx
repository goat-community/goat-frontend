import { Checkbox, FormControlLabel, Stack, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

import { useTranslation } from "@/i18n/client";

import type { FeatureLayerProperties, LayerFieldType } from "@/lib/validations/layer";

import FormLabelHelper from "@/components/common/FormLabelHelper";
import LayerFieldSelector from "@/components/map/common/LayerFieldSelector";
import SectionOptions from "@/components/map/panels/common/SectionOptions";
import SliderInput from "@/components/map/panels/common/SliderInput";

const Settings = ({
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
  const { t } = useTranslation("common");

  const [value, setValue] = useState(
    layerStyle?.[`${type}_field`] ? layerStyle?.[`${type}_range`] || [0, 50] : layerStyle?.[`${type}`] || 0
  );

  const isRange = useMemo(() => (layerStyle?.[`${type}_field`] ? true : false), [layerStyle, type]);

  const _onStyleChange = useCallback(
    (value, type) => {
      const newStyle = JSON.parse(JSON.stringify(layerStyle)) || {};
      // if (isRange) {
      //   newStyle[`${type}_range`] = value;
      // } else {
      //   newStyle[`${type}`] = value;
      // }
      newStyle[`${type}`] = value;
      onStyleChange && onStyleChange(newStyle);
    },
    [layerStyle, onStyleChange]
  );

  return (
    <>
      <SectionOptions
        active={!!active}
        collapsed={collapsed}
        baseOptions={
          <Stack direction="column" spacing={4}>
            <Stack>
              <FormLabelHelper label={t("size")} color="inherit" />
              <SliderInput
                value={value}
                onChange={setValue}
                onChangeCommitted={(value) => _onStyleChange(value, type)}
                isRange={isRange}
                rootSx={{
                  pl: 3,
                  pr: 2,
                }}
              />
            </Stack>
            {type === "marker_size" && (
              <Stack>
                <FormLabelHelper label={t("placement")} color="inherit" />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      color="primary"
                      checked={layerStyle?.["marker_allow_overlap"] || false}
                      onChange={(e) => {
                        const allowOverlap = e.target.checked;
                        _onStyleChange(allowOverlap, "marker_allow_overlap");
                      }}
                    />
                  }
                  label={<Typography variant="body2">{t("allow_overlap")}</Typography>}
                />
              </Stack>
            )}
          </Stack>
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
              label={t(`${type}_based_on`)}
              tooltip={t(`${type}_based_on_desc`)}
            />
          </>
        }
      />
    </>
  );
};

export default Settings;
