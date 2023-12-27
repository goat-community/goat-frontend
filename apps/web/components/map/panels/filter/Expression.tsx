import React, { useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  useTheme,
  TextField,
} from "@mui/material";
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

import { Expression } from "@/lib/validations/filter";
import type { LayerExpressions } from "@/lib/validations/filter";
import type { UseFormSetValue } from "react-hook-form";
import type { SelectChangeEvent } from "@mui/material";
import { ZodNullable } from "zod";

interface ExpressionProps {
  expression: Expression;
  setValue: UseFormSetValue<LayerExpressions>;
  modifyExpression: (key: string, value: string, expressionId: string) => void;
}

const Expression = React.memo(function Expression(props: ExpressionProps) {
  const {
    expression,
    // setValue,
    modifyExpression,
  } = props;
  const { projectId } = useParams();
  // const [attributeType, setAttributeType] = useState();

  const { t } = useTranslation("maps");
  const activeLayer = useActiveLayer(projectId as string);
  const theme = useTheme();

  const { data } = useUniqueValues(
    activeLayer ? activeLayer.layer_id : "",
    expression.attribute,
  );

  const optionsStatistic = Object.keys(data ? data : {}).map((option) => ({
    value: option,
    label: option,
  }));

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

  const expandMoreOption = () => {};

  const getValueCollector = () => {
    switch (expression.expression) {
      case "is":
      case "is_not":
        if (attributeType === "string") {
          return (
            <TextOption
              value={expression.value as string}
              setChange={(value: string) =>
                modifyExpression("value", value, expression.id)
              }
              options={optionsStatistic}
            />
          );
        } else {
          return (
            <NumberOption
              value={expression.value as string}
              setChange={(value: string) =>
                modifyExpression("value", value, expression.id)
              }
              options={optionsStatistic}
            />
          );
        }
      case "ends_with":
      case "contains_the_text":
      case "does_not_contains_the_text":
        return (
          <TextOption
            value={expression.value as string}
            setChange={(value: string) =>
              modifyExpression("value", value, expression.id)
            }
            options={optionsStatistic}
          />
        );
        break;
      case "includes":
      case "excludes":
        return (
          <SelectOption
            value={expression.value as string}
            setChange={(value: string) =>
              modifyExpression("value", value, expression.id)
            }
            options={["hi"]}
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
              modifyExpression("value", value, expression.id)
            }
            options={optionsStatistic}
          />
        );
      case "is_between":
        return (
          <DualNumberOption
            value1={expression.value.split("-")[0]}
            setChange1={(value: string) =>
              modifyExpression(
                "value",
                `${value}-${expression.value.split("-")[1]}`,
                expression.id,
              )
            }
            value2={expression.length ? expression.value.split("-")[1] : ""}
            setChange2={(value: string) =>
              modifyExpression(
                "value",
                `${expression.value.split("-")[0]}-${value}`,
                expression.id,
              )
            }
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    console.log(expression);
  }, []);

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
        <IconButton onClick={expandMoreOption}>
          <Icon iconName={ICON_NAME.ELLIPSIS} />
        </IconButton>
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
            modifyExpression("attribute", event.target.value, expression.id);
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
          disabled={!attributeType}
          value={expression.expression}
          label={t("panels.filter.select_an_expression")}
          onChange={(event: SelectChangeEvent) =>
            modifyExpression("expression", event.target.value, expression.id)
          }
        >
          {attributeType
            ? comparerModes[attributeType].map((attr) => (
                <MenuItem key={v4()} value={attr.value}>
                  {attr.label}
                </MenuItem>
              ))
            : ZodNullable}
        </Select>
      </FormControl>
      {getValueCollector()}
    </Box>
  );
});

export default Expression;
