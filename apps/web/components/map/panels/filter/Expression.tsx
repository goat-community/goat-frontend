import React, { useEffect, useMemo, useState } from "react";
import {
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import {
  FilterType,
  type Expression as ExpressionType,
  SpatialIntersectionGeomType,
} from "@/lib/validations/filter";
import { useTranslation } from "@/i18n/client";
import { FilterExpressionActions } from "@/types/common";
import type { PopperMenuItem } from "@/components/common/PopperMenu";
import MoreMenu from "@/components/common/PopperMenu";
import useLayerFields from "@/hooks/map/CommonHooks";
import { useActiveLayer } from "@/hooks/map/LayerPanelHooks";
import LayerFieldSelector from "@/components/map/common/LayerFieldSelector";
import { useParams } from "next/navigation";
import Selector from "@/components/map/panels/common/Selector";
import useLogicalExpressionOperations from "@/hooks/map/FilteringHooks";
import type { SelectorItem } from "@/types/map/common";
import TextFieldInput from "@/components/map/panels/common/TextFieldInput";
import SelectorLayerValue from "@/components/map/panels/common/SelectorLayerValue";
import { useMap } from "react-map-gl";
import bboxPolygon from "@turf/bbox-polygon";
import bbox from "@turf/bbox";
import type { BBox } from "@turf/helpers";

type ExpressionProps = {
  expression: ExpressionType;
  onDelete: (expression: ExpressionType) => void;
  onUpdate: (expression: ExpressionType) => void;
  onDuplicate: (expression: ExpressionType) => void;
};

const Expression: React.FC<ExpressionProps> = (props) => {
  const theme = useTheme();
  const { map } = useMap();

  const [expression, setExpression] = useState<ExpressionType>(
    props.expression,
  );

  const { t } = useTranslation("common");
  const { projectId } = useParams();

  const spatialIntersectionOptions: SelectorItem[] = useMemo(
    () => [
      {
        value: SpatialIntersectionGeomType.BBOX,
        label: t("map_extent"),
        icon: ICON_NAME.BOUNDING_BOX,
      },
      {
        value: SpatialIntersectionGeomType.BOUNDARY,
        label: t("boundary"),
        icon: ICON_NAME.DRAW_POLYGON,
      },
    ],
    [t],
  );

  const { activeLayer } = useActiveLayer(projectId as string);
  const { layerFields } = useLayerFields(activeLayer?.layer_id || "");
  const selectedAttribute = useMemo(() => {
    return layerFields.find((field) => field.name === expression.attribute);
  }, [layerFields, expression.attribute]);

  const { logicalExpressionTypes } = useLogicalExpressionOperations(
    selectedAttribute?.type,
  );

  const selectedExpressionOperation = useMemo(() => {
    const operation = logicalExpressionTypes.find(
      (operation) => operation.value === expression.expression,
    );
    return operation;
  }, [expression.expression, logicalExpressionTypes]);

  const hasExpressionChanged = useMemo(() => {
    return JSON.stringify(expression) !== JSON.stringify(props.expression);
  }, [expression, props.expression]);

  const isExpressionValid = useMemo(() => {
    return (
      expression.attribute &&
      expression.expression &&
      !!expression.value.toString()
    );
  }, [expression]);

  const expressionMoreMenuOptions = useMemo(() => {
    const layerStyleMoreMenuOptions: PopperMenuItem[] = [
      {
        id: FilterExpressionActions.DELETE,
        label: t("delete"),
        icon: ICON_NAME.TRASH,
        color: theme.palette.error.main,
      },
      {
        id: FilterExpressionActions.DUPLICATE,
        label: t("duplicate"),
        disabled: !isExpressionValid,
        icon: ICON_NAME.COPY,
        color: theme.palette.text.secondary,
      },
    ];

    return layerStyleMoreMenuOptions;
  }, [
    isExpressionValid,
    t,
    theme.palette.error.main,
    theme.palette.text.secondary,
  ]);

  useEffect(() => {
    if (hasExpressionChanged && isExpressionValid) {
      props.onUpdate(expression);
    }
  }, [expression, hasExpressionChanged, isExpressionValid, props]);

  const selectedIntersection = useMemo(() => {
    if (!expression.value || expression.type !== FilterType.Spatial) return;
    const geometry = JSON.parse(expression.value as string);
    const type = geometry?.properties?.type;
    return spatialIntersectionOptions.find(
      (intersection) => intersection.value === type,
    );
  }, [expression.type, expression.value, spatialIntersectionOptions]);

  const formatedFeatureLabel = useMemo(() => {
    if (!expression.value || expression.type !== FilterType.Spatial) return "";
    const geometry = JSON.parse(expression.value as string);
    if (geometry?.properties?.type === SpatialIntersectionGeomType.BBOX) {
      const _bbox = bbox(geometry);
      return `SW(${_bbox[0].toFixed(2)}, ${_bbox[1].toFixed(2)}); NE(${_bbox[2].toFixed(2)}, ${_bbox[3].toFixed(2)})`;
    }
    return geometry?.properties?.label;
  }, [expression.type, expression.value]);

  return (
    <>
      <Stack direction="column">
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" alignItems="center">
            <Icon
              iconName={
                expression.type === FilterType.Logical
                  ? ICON_NAME.TABLE
                  : ICON_NAME.MAP
              }
              style={{
                fontSize: "17px",
                color: theme.palette.text.secondary,
              }}
            />
            <Typography variant="body2" fontWeight="bold" sx={{ pl: 2 }}>
              {t(`${expression.type}_expression`)}
            </Typography>
          </Stack>
          <MoreMenu
            menuItems={expressionMoreMenuOptions}
            menuButton={
              <Tooltip title={t("more_options")} arrow placement="top">
                <IconButton>
                  <Icon
                    iconName={ICON_NAME.MORE_HORIZ}
                    style={{ fontSize: 15 }}
                  />
                </IconButton>
              </Tooltip>
            }
            onSelect={async (menuItem: PopperMenuItem) => {
              if (menuItem.id === FilterExpressionActions.DELETE) {
                props.onDelete(expression);
              }
              if (menuItem.id === FilterExpressionActions.DUPLICATE) {
                props.onDuplicate(expression);
              }
            }}
          />
        </Stack>
        <Stack direction="column" spacing={2}>
          {/* {LOGICAL FILTER} */}
          {expression.type === FilterType.Logical && (
            <>
              <LayerFieldSelector
                label={t("select_field")}
                fields={layerFields}
                selectedField={selectedAttribute}
                setSelectedField={(field) => {
                  const existingFieldType = selectedAttribute?.type;
                  const newFieldType = field?.type;
                  let newExpression = {
                    ...expression,
                    value: "",
                    attribute: field?.name || "",
                  };
                  if (newFieldType !== existingFieldType) {
                    newExpression = {
                      ...newExpression,
                      expression: "",
                    };
                  }
                  setExpression(newExpression);
                }}
              />
              <Selector
                disabled={!selectedAttribute}
                selectedItems={selectedExpressionOperation}
                setSelectedItems={(selectedExpression: SelectorItem) =>
                  setExpression({
                    ...expression,
                    value: "",
                    expression: selectedExpression?.value as string,
                  })
                }
                items={logicalExpressionTypes}
                label={t("select_operator")}
              />
              {selectedAttribute && selectedExpressionOperation && (
                <>
                  {/* Free Text Input */}
                  {[
                    "starts_with",
                    "ends_with",
                    "contains_the_text",
                    "does_not_contains_the_text",
                  ].includes(selectedExpressionOperation.value as string) && (
                    <TextFieldInput
                      type="text"
                      label={t("enter_value")}
                      value={expression.value as string}
                      onChange={(value: string) => {
                        setExpression({
                          ...expression,
                          value,
                        });
                      }}
                    />
                  )}
                  {/* {Value Selector} */}
                  {["is", "is_not"].includes(
                    selectedExpressionOperation.value as string,
                  ) && (
                    <SelectorLayerValue
                      selectedValues={expression.value as string}
                      onSelectedValuesChange={(values: string | null) => {
                        const fieldType = selectedAttribute?.type;
                        if (fieldType === "number" && values) {
                          setExpression({
                            ...expression,
                            value: Number(values),
                          });
                        }
                        if (fieldType === "string" && values) {
                          setExpression({
                            ...expression,
                            value: values,
                          });
                        }
                      }}
                      layerId={activeLayer?.layer_id || ""}
                      fieldName={expression.attribute}
                      label={t("select_value")}
                    />
                  )}

                  {["includes", "excludes"].includes(
                    selectedExpressionOperation.value as string,
                  ) && (
                    <SelectorLayerValue
                      selectedValues={
                        expression.value
                          ? (expression.value as unknown[]).map(String)
                          : []
                      }
                      onSelectedValuesChange={(values: string[] | null) => {
                        const fieldType = selectedAttribute?.type;
                        if (fieldType === "number" && values) {
                          const _values = values.map((value) => Number(value));
                          setExpression({
                            ...expression,
                            value: _values as number[],
                          });
                        }
                        if (fieldType === "string" && values) {
                          setExpression({
                            ...expression,
                            value: values as string[],
                          });
                        }
                      }}
                      layerId={activeLayer?.layer_id || ""}
                      fieldName={expression.attribute}
                      label={t("select_values")}
                      multiple
                    />
                  )}

                  {/* Number Input */}
                  {[
                    "is_at_least",
                    "is_less_than",
                    "is_at_most",
                    "is_greater_than",
                  ].includes(selectedExpressionOperation.value as string) && (
                    <>
                      <TextFieldInput
                        type="number"
                        label={t("enter_value")}
                        value={expression.value as string}
                        onChange={(value: string) => {
                          const numberValue = Number(value);
                          setExpression({
                            ...expression,
                            value: numberValue,
                          });
                        }}
                      />
                    </>
                  )}
                </>
              )}
            </>
          )}
          {/* {SPATIAL FILTER} */}
          {expression.type === FilterType.Spatial && (
            <>
              <Selector
                selectedItems={selectedIntersection}
                placeholder={t("select_spatial_intersection")}
                setSelectedItems={(item: SelectorItem) => {
                  let coordinates = [] as number[][];
                  if (item.value === SpatialIntersectionGeomType.BBOX) {
                    const bbox = map?.getBounds().toArray().flat();
                    if (bbox) {
                      const polygon = bboxPolygon(bbox as BBox);
                      const geometry = polygon.geometry;
                      coordinates =
                        geometry.coordinates as unknown as number[][];
                    }
                  }
                  const geometry = {
                    coordinates,
                    type: "Polygon",
                    properties: {
                      type: item.value,
                      label: item.label,
                    },
                  };
                  setExpression({
                    ...expression,
                    attribute: "geom",
                    expression: "s_intersects",
                    value: JSON.stringify(geometry),
                  });
                }}
                items={spatialIntersectionOptions}
                label={t("select_spatial_intersection")}
              />
              {selectedIntersection?.value ===
                SpatialIntersectionGeomType.BBOX && (
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="end"
                  sx={{ pt: 2 }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {formatedFeatureLabel}
                  </Typography>
                  <Tooltip title={t("use_current_map_extent")} arrow>
                    <IconButton
                      color="secondary"
                      aria-label="refresh map extent coords"
                      onClick={() => {
                        const bbox = map?.getBounds().toArray().flat();
                        if (bbox) {
                          const polygon = bboxPolygon(bbox as BBox);
                          const geometry = polygon.geometry;
                          //There is no "properties" key in the geometry object in the GeoJSON spec
                          //This is a bit hacky, but it doesn't break the backend and we can reuse to extract information
                          //from the geometry object on the intersectionType and the label.
                          geometry["properties"] = {
                            type: "bbox",
                            label: "Map Extent",
                          };
                          setExpression({
                            ...expression,
                            attribute: "geom",
                            expression: "s_intersects",
                            value: JSON.stringify(geometry),
                          });
                        }
                      }}
                    >
                      <Icon iconName={ICON_NAME.REFRESH} fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}
              {selectedIntersection?.value ===
                SpatialIntersectionGeomType.BOUNDARY && <div>Boundary</div>}
            </>
          )}
        </Stack>
      </Stack>
      <Divider />
    </>
  );
};

export default Expression;
