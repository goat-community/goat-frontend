import LayerFieldSelector from "@/components/map/panels/style/classification/LayerFieldSelector";
import OptionsCollapse from "@/components/map/panels/style/other/OptionsCollapse";
import { useTranslation } from "@/i18n/client";
import type {
  FeatureLayerProperties,
  LayerFieldType,
} from "@/lib/validations/layer";
import { Slider, Stack, useTheme } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useCallback, useMemo, useState } from "react";

const InputStyled = ({ value, onChange, onBlur }) => {
  return (
    <OutlinedInput
      value={value}
      size="small"
      onChange={onChange}
      onBlur={onBlur}
      sx={{ pr: 0 }}
      inputProps={{
        step: 1,
        min: 0,
        max: 100,
        type: "number",
        style: {
          width: "50px",
          padding: "0px 0px 0px 10px",
          height: "32px",
          fontSize: "0.75rem",
        },
      }}
    />
  );
};

const SizeOptions = ({
  type,
  layerStyle,
  active,
  collapsed,
  onStyleChange,
  selectedField,
  layerFields,
}: {
  type: "stroke_width" | "radius";
  layerStyle?: FeatureLayerProperties;
  active: boolean;
  collapsed?: boolean;
  onStyleChange?: (newStyle: FeatureLayerProperties) => void;
  selectedField?: LayerFieldType;
  layerFields: LayerFieldType[];
}) => {
  const { t } = useTranslation(["maps", "common"]);
  const theme = useTheme();

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
          <Stack
            sx={{ pl: 3, pr: 2 }}
            direction={isRange ? "column" : "row"}
            spacing={4}
            alignItems="center"
          >
            <Slider
              size="small"
              value={value}
              onChange={(_event, newValue) => {
                setValue(newValue);
              }}
              onChangeCommitted={(_event: Event, value: number | number[]) => {
                _onStyleChange(value);
              }}
            />
            {!isRange && (
              <Stack>
                <InputStyled
                  value={value}
                  onChange={(event) => {
                    setValue(Number(event.target.value));
                  }}
                  onBlur={() => {
                    _onStyleChange(value);
                  }}
                />
              </Stack>
            )}
            {isRange && (
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
                style={{ marginTop: theme.spacing(1) }}
              >
                <InputStyled
                  value={value[0]}
                  onChange={(event) => {
                    setValue([Number(event.target.value), value[1]]);
                  }}
                  onBlur={() => {
                    _onStyleChange(value);
                  }}
                />
                <InputStyled
                  value={value[1]}
                  onChange={(event) => {
                    setValue([value[0], Number(event.target.value)]);
                  }}
                  onBlur={() => {
                    _onStyleChange(value);
                  }}
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
