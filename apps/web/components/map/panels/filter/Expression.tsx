import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  debounce,
  FormControl,
  InputLabel,
  MenuItem,
  useTheme,
  Button,
  MenuList,
} from "@mui/material";
import CustomMenu from "@/components/common/CustomMenu";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useTranslation } from "@/i18n/client";
import { useActiveLayer } from "@/hooks/map/LayerPanelHooks";
import { useParams } from "next/navigation";
import { useGetLayerKeys } from "@/hooks/map/ToolsHooks";
import { v4 } from "uuid";
import { comparerModes } from "@/public/assets/data/comparers_filter";
import {
  TextOption,
  NumberOption,
  SelectOption,
  DualNumberOption,
} from "@/components/map/panels/filter/nonuse/FilterOption";
import { useUniqueValues } from "@/lib/api/layers";

import type { Expression as ExpressionType } from "@/lib/validations/filter";
import type { SelectChangeEvent } from "@mui/material";

interface ExpressionProps {
  expression: ExpressionType;
  modifyExpression: (
    expression: ExpressionType,
    key: string,
    value: string | string[] | number,
  ) => void;
  deleteOneExpression: (expression: ExpressionType) => void;
  duplicateExpression: (expression: ExpressionType) => void;
}

const Expression = React.memo(function Expression(props: ExpressionProps) {
  const {
    expression,
    modifyExpression,
    deleteOneExpression,
    duplicateExpression,
  } = props;
  const { projectId } = useParams();

  const [expressionValue, setExpressionValue] = useState(expression.value);
  const [anchorEl, setAnchorEl] = React.useState<boolean>(false);

  const { t } = useTranslation("maps");
  const { activeLayer } = useActiveLayer(projectId as string);
  const open = Boolean(anchorEl);

  const theme = useTheme();

  const { data } = useUniqueValues(
    activeLayer ? activeLayer.layer_id : "",
    expression.attribute,
  );

  const optionsStatistic = Object.keys(data ? data : {}).map((option) => ({
    value: option,
    label: option,
  }));

  const debounceEffect = (
    expression: ExpressionType,
    key: string,
    value: string,
  ) => {
    setExpressionValue(value);
    debounce(() => {
      modifyExpression(expression, key, value);
    }, 500)();
  };

  const getValueCollector = () => {
    switch (expression.expression) {
      case "is":
      case "is_not":
        if (attributeType === "string") {
          return (
            <TextOption
              value={expressionValue as string}
              setChange={(value: string) =>
                debounceEffect(expression, "value", value)
              }
              options={optionsStatistic}
            />
          );
        } else {
          return (
            <NumberOption
              value={expression.value as string}
              setChange={(value: string) => {
                modifyExpression(expression, "value", parseFloat(value));
              }}
              options={optionsStatistic}
            />
          );
        }
      case "starts_with":
      case "ends_with":
      case "contains_the_text":
      case "does_not_contains_the_text":
        return (
          <TextOption
            value={expression.value as string}
            setChange={(value: string) =>
              modifyExpression(expression, "value", value)
            }
            options={optionsStatistic}
          />
        );
        break;
      case "includes":
      case "excludes":
        return (
          <SelectOption
            value={
              (typeof expression.value === "string"
                ? expression.value.split(",")
                : expression.value) as string[]
            }
            setChange={(value: string[]) => {
              modifyExpression(expression, "value", value);
            }}
            options={optionsStatistic}
          />
        );
      case "is_at_least":
      case "is_less_than":
      case "is_at_most":
      case "is_greater_than":
        return (
          <NumberOption
            value={expression.value as string}
            setChange={(value: string) =>
              modifyExpression(expression, "value", parseFloat(value))
            }
            options={optionsStatistic}
          />
        );
      case "is_between":
        return (
          <DualNumberOption
            value1={
              typeof expression.value === "string"
                ? expression.value.split("-")[0]
                : "0"
            }
            setChange1={(value: string) =>
              modifyExpression(
                expression,
                "value",
                `${value.length ? value : "0"}-${
                  typeof expression.value === "string" && expression.value.split("-").length > 1
                    ? expression.value.split("-")[1]
                    : "0"
                }`,
              )
            }
            value2={
              typeof expression.value === "string"
                ? expression.value.split("-")[1]
                : "0"
            }
            setChange2={(value: string) =>
              modifyExpression(
                expression,
                "value",
                `${
                  typeof expression.value === "string" && expression.value.split("-").length > 1
                    ? expression.value.split("-")[0]
                    : "0"
                }-${value.length ? value : "0"}`,
              )
            }
          />
        );
      default:
        return null;
    }
  };

  const layerAttributes = useGetLayerKeys(
    `user_data.${(activeLayer ? activeLayer.layer_id : "")
      .split("-")
      .join("")}`,
  );

  const attributeType = layerAttributes.keys.filter(
    (attrib) => attrib.name === expression.attribute,
  ).length
    ? layerAttributes.keys.filter(
        (attrib) => attrib.name === expression.attribute,
      )[0].type
    : undefined;

  function toggleMorePopover() {
    setAnchorEl(!anchorEl);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(3),
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography>{t("panels.filter.expression")}</Typography>
        <Box sx={{ position: "relative" }}>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={toggleMorePopover}
            variant="text"
          >
            <Icon iconName={ICON_NAME.ELLIPSIS} />
          </Button>
          {open ? (
            <CustomMenu close={toggleMorePopover}>
              <MenuList>
                <MenuItem onClick={() => deleteOneExpression(expression)}>
                  {t("panels.filter.delete_expression")}
                </MenuItem>
                <MenuItem onClick={() => duplicateExpression(expression)}>
                  {t("panels.filter.duplicate")}
                </MenuItem>
              </MenuList>
            </CustomMenu>
          ) : null}
        </Box>
      </Box>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          {t("panels.filter.select_attribute")}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={expression.attribute}
          label={t("panels.filter.select_attribute")}
          onChange={(event: SelectChangeEvent) => {
            modifyExpression(expression, "attribute", event.target.value);
            setExpressionValue("");
          }}
        >
          {layerAttributes.keys.map((attr) => (
            <MenuItem key={v4()} value={attr.name}>
              {attr.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          {t("panels.filter.select_an_expression")}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          // disabled={!attributeType}
          value={expression.expression}
          label={t("panels.filter.select_an_expression")}
          onChange={(event: SelectChangeEvent) => {
            modifyExpression(expression, "expression", event.target.value);
            setExpressionValue("");
          }}
        >
          {attributeType
            ? comparerModes[attributeType].map((attr) => (
                <MenuItem key={v4()} value={attr.value}>
                  {attr.label}
                </MenuItem>
              ))
            : null}
        </Select>
      </FormControl>
      {/* <TextField
        value={expression.value}
        onChange={(e) =>
          modifyExpression(expression, "value", e.target.value)
        }
      /> */}
      {getValueCollector()}
    </Box>
  );
});

export default Expression;
