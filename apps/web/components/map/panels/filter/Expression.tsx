import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  debounce,
  FormControl,
  InputLabel,
  MenuItem,
  useTheme,
  MenuList,
  IconButton,
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
} from "@/components/map/panels/filter/FilterOption";
import { useUniqueValues } from "@/lib/api/layers";
import { useMap } from "react-map-gl";
import type { Expression as ExpressionType } from "@/lib/validations/filter";
import type { SelectChangeEvent } from "@mui/material";
import BoundingBoxInput from "@/components/map/panels/filter/BoundingBoxInput";
import LayerFieldSelector from "@/components/map/common/LayerFieldSelector";

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
  const [statisticsPage, setStatisticsPage] = React.useState<number>(1);
  const [statisticsData, setStatisticsData] = React.useState<string[]>([]);

  const { t } = useTranslation("maps");
  const { activeLayer } = useActiveLayer(projectId as string);
  const open = Boolean(anchorEl);
  const { map } = useMap();
  const theme = useTheme();

  const { data } = useUniqueValues(
    activeLayer ? activeLayer.layer_id : "",
    expression.attribute,
    statisticsPage,
  );

  useEffect(() => {
    if (data) {
      setStatisticsData([
        ...statisticsData,
        ...data.items.map((val) => val.value),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const optionsStatistic = statisticsData.map((option) => ({
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
        if (
          expression.expression === "is" &&
          expression.attribute === "Bounding Box"
        ) {
          return (
            <BoundingBoxInput
              bounds={expression.value as string}
              onChange={(value: string) =>
                debounceEffect(expression, "value", value)
              }
            />
          );
        }
        if (attributeType === "string") {
          return (
            <TextOption
              value={expressionValue as string}
              setChange={(value: string) => {
                debounceEffect(expression, "value", value);
              }}
              options={optionsStatistic}
              fetchMoreData={() => {
                setStatisticsPage(statisticsPage + 1);
              }}
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
              fetchMoreData={() => {
                setStatisticsPage(statisticsPage + 1);
              }}
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
            fetchMoreData={() => {
              setStatisticsPage(statisticsPage + 1);
            }}
          />
        );
      case "includes":
      case "excludes":
        return (
          <SelectOption
            value={
              (typeof expression.value === "string"
                ? expression.value.split(",")
                : expression.value) as string[]
            }
            fetchMoreData={() => {
              setStatisticsPage(statisticsPage + 1);
            }}
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
            fetchMoreData={() => {
              setStatisticsPage(statisticsPage + 1);
            }}
          />
        );
      case "is_between":
        return (
          <DualNumberOption
            options={optionsStatistic}
            fetchMoreData={() => {
              setStatisticsPage(statisticsPage + 1);
            }}
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
                  typeof expression.value === "string" &&
                  expression.value.split("-").length > 1
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
                  typeof expression.value === "string" &&
                  expression.value.split("-").length > 1
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

  const layerSpatialAttributes = [
    {
      name: "Bounding Box",
      type: "number",
    },
  ];

  layerAttributes.keys.push({
    name: "Bounding Box",
    type: "number",
  });

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

  const targetFieldChangeHandler = (field: {
    type: "string" | "number";
    name: string;
  }) => {
    if (field) {
      modifyExpression(expression, "attribute", field.name);
      if (field.name === "Bounding Box" && map) {
        expression.attribute = field.name;
        expression.value = `${map.getBounds().getSouthWest().toArray()[0]},${
          map.getBounds().getSouthWest().toArray()[1]
        },${map.getBounds().getNorthEast().toArray()[0]},${
          map.getBounds().getNorthEast().toArray()[1]
        }`;
        setExpressionValue(
          `${map.getBounds().getSouthWest().toArray()[0]},${
            map.getBounds().getSouthWest().toArray()[1]
          },${map.getBounds().getNorthEast().toArray()[0]},${
            map.getBounds().getNorthEast().toArray()[1]
          }`,
        );
        modifyExpression(expression, "expression", "is");
        expression.expression = "is";
        debounceEffect(
          expression,
          "value",
          `${map.getBounds().getSouthWest().toArray()[0]},${
            map.getBounds().getSouthWest().toArray()[1]
          },${map.getBounds().getNorthEast().toArray()[0]},${
            map.getBounds().getNorthEast().toArray()[1]
          }`,
        );
      }
    } else {
      modifyExpression(expression, "attribute", "");
    }
    setStatisticsData([]);
    setExpressionValue("");
  };

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
        <Typography
          fontWeight="bold"
          color={theme.palette.text.secondary}
          sx={{ display: "flex", alignItems: "center", gap: theme.spacing(2) }}
        >
          <Icon
            iconName={
              expression.type === "regular"
                ? ICON_NAME.EDITPEN
                : ICON_NAME.MOUNTAIN
            }
            sx={{ fontSize: "18px" }}
          />
          {expression.type === "regular"
            ? t("panels.filter.logical_expression")
            : t("panels.filter.spatial_expression")}
        </Typography>
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={toggleMorePopover}
            sx={{ padding: theme.spacing(1), width: "fit-content" }}
          >
            <Icon iconName={ICON_NAME.ELLIPSIS} />
          </IconButton>
          {open ? (
            <CustomMenu close={toggleMorePopover}>
              <MenuList>
                <MenuItem onClick={() => deleteOneExpression(expression)}>
                  <Icon
                    iconName={ICON_NAME.TRASH}
                    htmlColor={theme.palette.text.secondary}
                    sx={{ fontSize: "14px" }}
                  />
                  {/* {t("panels.filter.delete_expression")} */}
                  <Typography
                    variant="body1"
                    sx={{ ml: 2, fontWeight: 600 }}
                    color={theme.palette.text.secondary}
                  >
                    {t("panels.filter.delete")}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => duplicateExpression(expression)}>
                  <Icon
                    iconName={ICON_NAME.CLONE}
                    htmlColor={theme.palette.text.secondary}
                    sx={{ fontSize: "14px" }}
                  />
                  <Typography
                    variant="body1"
                    sx={{ ml: 2, fontWeight: 600 }}
                    color={theme.palette.text.secondary}
                  >
                    {t("panels.filter.duplicate")}
                  </Typography>
                </MenuItem>
              </MenuList>
            </CustomMenu>
          ) : null}
        </Box>
      </Box>
      <LayerFieldSelector
        label="Target Field"
        selectedField={
          expression.type === "regular"
            ? layerAttributes.keys.filter(
                (key) => key.name === expression.attribute,
              )[0]
            : layerSpatialAttributes.filter(
                (key) => key.name === expression.attribute,
              )[0]
        }
        setSelectedField={targetFieldChangeHandler}
        fields={
          expression.type === "regular"
            ? layerAttributes.keys
            : layerSpatialAttributes
        }
      />
      <FormControl fullWidth>
        <InputLabel>{t("panels.filter.select_an_expression")}</InputLabel>
        <Select
          value={expression.expression}
          label={t("panels.filter.select_an_expression")}
          onChange={(event: SelectChangeEvent) => {
            modifyExpression(expression, "expression", event.target.value);
            setExpressionValue("");
          }}
          disabled={expression.attribute === "Bounding Box"}
        >
          {attributeType
            ? comparerModes[attributeType].map((attr) => (
                <MenuItem key={v4()} value={attr.value}>
                  {t(`panels.filter.expressions.${attr.value}`)}
                </MenuItem>
              ))
            : null}
        </Select>
      </FormControl>
      {getValueCollector()}
    </Box>
  );
});

export default Expression;
