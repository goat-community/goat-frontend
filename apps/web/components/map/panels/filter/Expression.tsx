import React, { useState, useEffect } from "react";
import { Box, Typography, debounce, MenuItem, useTheme } from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useTranslation } from "@/i18n/client";
import { useActiveLayer } from "@/hooks/map/LayerPanelHooks";
import { useParams } from "next/navigation";
import { useGetLayerKeys } from "@/hooks/map/ToolsHooks";
import { comparerModes } from "@/public/assets/data/comparers_filter";
import { useUniqueValues } from "@/lib/api/layers";
import { useMap } from "react-map-gl";
import BoundingBoxInput from "@/components/map/panels/filter/BoundingBoxInput";
import LayerFieldSelector from "@/components/map/common/LayerFieldSelector";
import SectionHeader from "@/components/map/panels/common/SectionHeader";
import Selector from "@/components/map/panels/common/Selector";
import SelectionWithInput from "@/components/map/panels/common/SelectionWithInput";

import type { Expression as ExpressionType } from "@/lib/validations/filter";
import type { SelectorItem } from "@/types/map/common";

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
  const [statisticsPage, setStatisticsPage] = React.useState<number>(1);
  const [statisticsData, setStatisticsData] = React.useState<string[]>([]);

  const { t } = useTranslation("maps");
  const { activeLayer } = useActiveLayer(projectId as string);
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
    value: string | number,
  ) => {
    setExpressionValue(value);
    debounce(() => {
      modifyExpression(expression, key, value);
    }, 500)();
  };

  let debounceTimer;

  const onScrolling = (e) => {
    if (e.target) {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight;

      if (isNearBottom) {
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
          setStatisticsPage(statisticsPage + 1);
        }, 500);
      }
    }
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
            <SelectionWithInput
              onScrolling={onScrolling}
              enableSearch
              label={t("panels.filter.select_value")}
              placeholder={t("panels.filter.expression_value_placeholder")}
              selectedItems={
                expressionValue
                  ? {
                      value: expressionValue.toString(),
                      label: expressionValue.toString(),
                    }
                  : undefined
              }
              setSelectedItems={(
                item: SelectorItem[] | SelectorItem | undefined,
              ) => {
                debounceEffect(
                  expression,
                  "value",
                  item && !("length" in item) ? (item.value as string) : "",
                );
              }}
              items={optionsStatistic}
            />
          );
        } else {
          return (
            <SelectionWithInput
              enableSearch
              label={t("panels.filter.select_value")}
              placeholder={t("panels.filter.expression_value_placeholder")}
              selectedItems={
                expressionValue
                  ? {
                      value: expressionValue.toString(),
                      label: expressionValue.toString(),
                    }
                  : undefined
              }
              setSelectedItems={(item: SelectorItem | undefined) => {
                debounceEffect(
                  expression,
                  "value",
                  item && !("length" in item)
                    ? parseFloat(item.value as string)
                    : "",
                );
              }}
              items={optionsStatistic}
            />
          );
        }
      case "starts_with":
      case "ends_with":
      case "contains_the_text":
      case "does_not_contains_the_text":
        return (
          <SelectionWithInput
            enableSearch
            label={t("panels.filter.select_value")}
            placeholder={t("panels.filter.expression_value_placeholder")}
            selectedItems={
              expressionValue
                ? {
                    value: expressionValue.toString(),
                    label: expressionValue.toString(),
                  }
                : undefined
            }
            setSelectedItems={(
              item: SelectorItem[] | SelectorItem | undefined,
            ) => {
              debounceEffect(
                expression,
                "value",
                item && !("length" in item) ? (item.value as string) : "",
              );
            }}
            items={optionsStatistic}
          />
        );
      case "includes":
      case "excludes":
        console.log(typeof expression.value);
        return (
          <Selector
            multiple
            selectedItems={
              typeof expression.value === "string"
                ? []
                : typeof expression.value === "object"
                ? expression.value.map((value) => ({
                    value: value.toString(),
                    label: value.toString(),
                  }))
                : []
            }
            setSelectedItems={(item: SelectorItem[]) => {
              modifyExpression(
                expression,
                "value",
                item.map((itemValue) => itemValue.value) as string[],
              );
            }}
            items={optionsStatistic}
            enableSearch
            label={t("panels.filter.select_value")}
            placeholder={t("panels.filter.expression_value_placeholder")}
          />
        );
      case "is_at_least":
      case "is_less_than":
      case "is_at_most":
      case "is_greater_than":
        return (
          <SelectionWithInput
            enableSearch
            label={t("panels.filter.select_value")}
            placeholder={t("panels.filter.expression_value_placeholder")}
            selectedItems={
              expressionValue
                ? {
                    value: expressionValue.toString(),
                    label: expressionValue.toString(),
                  }
                : undefined
            }
            setSelectedItems={(
              item: SelectorItem[] | SelectorItem | undefined,
            ) => {
              debounceEffect(
                expression,
                "value",
                item && !("length" in item)
                  ? parseFloat(item.value as string)
                  : "",
              );
            }}
            items={optionsStatistic}
          />
        );
      case "is_between":
        return (
          <>
            <SelectionWithInput
              enableSearch
              label={t("panels.filter.select_value")}
              placeholder={t("panels.filter.expression_value_placeholder")}
              selectedItems={
                expressionValue
                  ? {
                      value: expressionValue.toString().split("-")[0],
                      label: expressionValue.toString().split("-")[0],
                    }
                  : undefined
              }
              setSelectedItems={(item: SelectorItem) => {
                debounceEffect(
                  expression,
                  "value",
                  `${
                    typeof item.value === "string" && item.value.length
                      ? item.value
                      : "0"
                  }-${
                    typeof expression.value === "string" &&
                    expression.value.split("-").length > 1
                      ? expression.value.split("-")[1]
                      : "0"
                  }`,
                );
              }}
              items={optionsStatistic}
            />
            <SelectionWithInput
              enableSearch
              label={t("panels.filter.select_value")}
              placeholder={t("panels.filter.expression_value_placeholder")}
              selectedItems={
                expressionValue
                  ? {
                      value: expressionValue.toString().split("-")[1],
                      label: expressionValue.toString().split("-")[1],
                    }
                  : undefined
              }
              setSelectedItems={(item: SelectorItem) => {
                debounceEffect(
                  expression,
                  "value",
                  `${
                    typeof expression.value === "string" &&
                    expression.value.split("-").length > 1
                      ? expression.value.split("-")[0]
                      : "0"
                  }-${
                    typeof item.value === "string" && item.value.length
                      ? item.value
                      : "0"
                  }`,
                );
              }}
              items={optionsStatistic}
            />
          </>
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

  const attributeType = layerAttributes.keys.filter(
    (attrib) => attrib.name === expression.attribute,
  ).length
    ? layerAttributes.keys.filter(
        (attrib) => attrib.name === expression.attribute,
      )[0].type
    : undefined;

  const targetFieldChangeHandler = (field: {
    type: "string" | "number";
    name: string;
  }) => {
    if (field) {
      modifyExpression(expression, "attribute", field.name);
      if (field.name === "Bounding Box") {
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
      <SectionHeader
        active={true}
        alwaysActive={true}
        label={
          expression.type === "regular"
            ? t("panels.filter.logical_expression")
            : t("panels.filter.spatial_expression")
        }
        icon={
          expression.type === "regular" ? ICON_NAME.EDITPEN : ICON_NAME.SPATIAL
        }
        disableAdvanceOptions={true}
        moreItems={
          <>
            <MenuItem onClick={() => deleteOneExpression(expression)}>
              <Icon
                iconName={ICON_NAME.TRASH}
                htmlColor={theme.palette.text.secondary}
                sx={{ fontSize: "14px" }}
              />
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
          </>
        }
      />
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
            ? layerAttributes.keys.filter(
                (attrib) => attrib.name !== "layer_id",
              )
            : layerSpatialAttributes
        }
      />
      <Selector
        selectedItems={
          expression.expression
            ? { value: expression.expression, label: expression.expression }
            : undefined
        }
        setSelectedItems={(item: SelectorItem[] | SelectorItem | undefined) => {
          modifyExpression(
            expression,
            "expression",
            item && !("length" in item) ? (item.value as string) : "",
          );
          setExpressionValue("");
        }}
        items={
          attributeType
            ? comparerModes[attributeType].map((mod) => ({
                value: mod.value,
                label: mod.value,
              }))
            : []
        }
        label={t("panels.filter.select_an_expression")}
        placeholder={t("panels.filter.expression_placeholder")}
      />
      {getValueCollector()}
    </Box>
  );
});

export default Expression;
