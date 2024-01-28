import Container from "@/components/map/panels/Container";
import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import { useTranslation } from "@/i18n/client";
import { setActiveRightPanel } from "@/lib/store/map/slice";
import ProjectLayerDropdown from "@/components/map/panels/ProjectLayerDropdown";
import { useActiveLayer } from "@/hooks/map/LayerPanelHooks";
import { updateProjectLayer, useProjectLayers } from "@/lib/api/projects";
import type {
  FeatureLayerProperties,
  LayerUniqueValues,
} from "@/lib/validations/layer";
import { useCallback, useMemo, useState } from "react";
import {
  getLayerClassBreaks,
  getLayerUniqueValues,
  updateDataset,
  useDataset,
  useLayerQueryables,
} from "@/lib/api/layers";
import Header from "@/components/map/panels/style/other/Header";
import ColorOptions from "@/components/map/panels/style/color/ColorOptions";
import SizeOptions from "@/components/map/panels/style/size/SizeOptions";
import type { ProjectLayer } from "@/lib/validations/project";
import type { PopperMenuItem } from "@/components/common/PopperMenu";
import MoreMenu from "@/components/common/PopperMenu";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { LayerStyleActions } from "@/types/common";
import { toast } from "react-toastify";

const LayerStylePanel = ({ projectId }: { projectId: string }) => {
  const { t } = useTranslation(["maps", "common"]);
  const dispatch = useDispatch();
  const { activeLayer } = useActiveLayer(projectId);
  const { dataset, mutate: mutateDataset } = useDataset(
    activeLayer?.layer_id || "",
  );
  const { layers: projectLayers, mutate: mutateProjectLayers } =
    useProjectLayers(projectId);

  const { queryables } = useLayerQueryables(activeLayer?.layer_id || "");

  const layerFields = useMemo(() => {
    if (!activeLayer || !queryables) return [];
    return Object.entries(queryables.properties)
      .filter(
        ([_key, value]) => value.type === "string" || value.type === "number",
      )
      .map(([key, value]) => {
        return {
          name: key,
          type: value.type,
        };
      });
  }, [activeLayer, queryables]);

  const updateLayerStyle = useCallback(
    async (newStyle: FeatureLayerProperties) => {
      if (!activeLayer) return;
      const layers = JSON.parse(JSON.stringify(projectLayers));
      const index = layers.findIndex((l) => l.id === activeLayer.id);
      const layerToUpdate = layers[index] as ProjectLayer;
      if (!layerToUpdate.properties) {
        layerToUpdate.properties = {} as FeatureLayerProperties;
      }

      layerToUpdate.properties = newStyle;
      await mutateProjectLayers(layers, false);
      await updateProjectLayer(projectId, activeLayer.id, layerToUpdate);
    },
    [activeLayer, projectLayers, mutateProjectLayers, projectId],
  );

  const updateColorClassificationBreaks = useCallback(
    async (
      updateType: "color" | "stroke_color",
      newStyle: FeatureLayerProperties,
    ) => {
      if (!activeLayer) return;
      if (!newStyle[`${updateType}_field`]?.name) return;
      if (
        newStyle[`${updateType}_scale`] !==
          activeLayer.properties[`${updateType}_scale`] ||
        newStyle[`${updateType}_field`]?.name !==
          activeLayer.properties[`${updateType}_field`]?.name ||
        newStyle[`${updateType}_range`]?.colors?.length !==
          activeLayer.properties[`${updateType}_range`]?.colors?.length
      ) {
        const breaks = await getLayerClassBreaks(
          activeLayer.layer_id,
          newStyle[`${updateType}_scale`],
          newStyle[`${updateType}_field`]?.name as string,
          newStyle[`${updateType}_range`]?.colors?.length - 1,
        );
        if (
          breaks &&
          breaks?.breaks?.length ===
            newStyle[`${updateType}_range`]?.colors?.length - 1
        )
          newStyle[`${updateType}_scale_breaks`] = breaks;
      }
    },
    [activeLayer],
  );

  const updateOrdinalValues = useCallback(
    async (
      updateType: "color" | "stroke_color",
      newStyle: FeatureLayerProperties,
    ) => {
      if (!activeLayer) return;
      if (!newStyle[`${updateType}_field`]?.name) return;
      const oldFieldName = activeLayer.properties[`${updateType}_field`]?.name;
      const newFieldName = newStyle[`${updateType}_field`]?.name;
      if (
        (newStyle[`${updateType}_scale`] === "ordinal" &&
          newStyle[`${updateType}_range`]?.name !==
            activeLayer.properties[`${updateType}_range`]?.name) ||
        !newStyle[`${updateType}_range`]?.color_map ||
        oldFieldName !== newFieldName
      ) {
        const colors = newStyle[`${updateType}_range`]?.colors;
        // const _existingColorMap = newStyle[`${updateType}_range`]?.color_map;
        // fetch unique values
        const uniqueValues = await getLayerUniqueValues(
          activeLayer.layer_id,
          newStyle[`${updateType}_field`]?.name as string,
          colors?.length,
        );

        const colorMap = [] as [string, string][];
        uniqueValues.items.forEach((item: LayerUniqueValues, index: number) => {
          colorMap.push([item.value, colors[index]]);
        });
        newStyle[`${updateType}_range`].color_map = colorMap;
      }
      updateLayerStyle(newStyle);
    },
    [activeLayer, updateLayerStyle],
  );

  const onToggleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, property: string) => {
      const newStyle =
        JSON.parse(JSON.stringify(activeLayer?.properties)) || {};
      newStyle[property] = event.target.checked;
      updateLayerStyle(newStyle);
    },
    [activeLayer, updateLayerStyle],
  );

  const resetStyle = useCallback(async () => {
    if (dataset?.properties) {
      const newStyle = JSON.parse(JSON.stringify(dataset.properties));
      await updateLayerStyle(newStyle);
    }
  }, [dataset, updateLayerStyle]);

  const saveStyleAsDatasetDefault = useCallback(async () => {
    if (dataset?.properties && activeLayer?.properties) {
      dataset.properties = JSON.parse(JSON.stringify(activeLayer.properties));
      try {
        await updateDataset(dataset.id, dataset);
        await mutateDataset(dataset, false);
        toast.success(t("maps:style_saved_as_dataset_default_success"));
      } catch (err) {
        toast.error(t("maps:style_saved_as_dataset_default_error"));
      }
    }
  }, [dataset, activeLayer?.properties, mutateDataset, t]);

  const layerStyleMoreMenuOptions = useMemo(() => {
    const layerStyleMoreMenuOptions: PopperMenuItem[] = [
      {
        id: LayerStyleActions.SAVE_AS_DEFAULT,
        label: t("common:save_as_default"),
        icon: ICON_NAME.SAVE,
      },
      {
        id: LayerStyleActions.RESET,
        label: t("common:reset"),
        icon: ICON_NAME.REFRESH,
      },
    ];

    return layerStyleMoreMenuOptions;
  }, [t]);

  const [collapseFillOptions, setCollapseFillOptions] = useState(true);
  const [collapseStrokeColorOptions, setCollapseStrokeColorOptions] =
    useState(true);
  const [collapseStrokeWidthOptions, setCollapseStrokeWidthOptions] =
    useState(true);
  const [collapseRadiusOptions, setCollapseRadiusOptions] = useState(true);
  const [collapseLabelOptions, setCollapseLabelOptions] = useState(true);

  return (
    <Container
      title="Layer Style"
      disablePadding={false}
      close={() => dispatch(setActiveRightPanel(undefined))}
      body={
        <>
          {activeLayer && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 4 }}
            >
              <ProjectLayerDropdown
                projectId={projectId}
                layerTypes={["feature"]}
              />
              <MoreMenu
                menuItems={layerStyleMoreMenuOptions}
                menuButton={
                  <Tooltip title={t("maps:more_options")} arrow placement="top">
                    <IconButton>
                      <Icon
                        iconName={ICON_NAME.MORE_VERT}
                        style={{ fontSize: 15 }}
                      />
                    </IconButton>
                  </Tooltip>
                }
                onSelect={async (menuItem: PopperMenuItem) => {
                  if (menuItem.id === LayerStyleActions.RESET) {
                    resetStyle();
                  } else if (
                    menuItem.id === LayerStyleActions.SAVE_AS_DEFAULT
                  ) {
                    saveStyleAsDatasetDefault();
                  }
                }}
              />
            </Stack>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {activeLayer && (
              <Stack>
                {/* {FILL COLOR} */}
                {activeLayer.feature_layer_geometry_type &&
                  ["polygon", "point"].includes(
                    activeLayer.feature_layer_geometry_type,
                  ) && (
                    <>
                      <Header
                        active={activeLayer?.properties.filled}
                        onToggleChange={(event) => {
                          onToggleChange(event, "filled");
                        }}
                        label={
                          activeLayer?.feature_layer_geometry_type === "line"
                            ? t("maps:color")
                            : t("maps:fill_color")
                        }
                        collapsed={collapseFillOptions}
                        setCollapsed={setCollapseFillOptions}
                      />
                      <ColorOptions
                        type="color"
                        layerStyle={activeLayer?.properties}
                        active={!!activeLayer?.properties.filled}
                        layerFields={layerFields}
                        collapsed={collapseFillOptions}
                        selectedField={activeLayer?.properties.color_field}
                        onStyleChange={async (
                          newStyle: FeatureLayerProperties,
                        ) => {
                          if (
                            newStyle.color_field?.type === "number" &&
                            newStyle.color_scale !== "ordinal"
                          ) {
                            await updateColorClassificationBreaks(
                              "color",
                              newStyle,
                            );
                          } else if (newStyle.color_scale === "ordinal") {
                            await updateOrdinalValues("color", newStyle);
                          }

                          updateLayerStyle(newStyle);
                        }}
                        layerId={activeLayer?.layer_id}
                      />
                    </>
                  )}

                {/* {STROKE COLOR} */}
                <Header
                  active={!!activeLayer?.properties.stroked}
                  onToggleChange={(event) => {
                    onToggleChange(event, "stroked");
                  }}
                  alwaysActive={
                    activeLayer?.feature_layer_geometry_type === "line"
                  }
                  label={
                    activeLayer?.feature_layer_geometry_type === "line"
                      ? t("maps:color")
                      : t("maps:stroke_color")
                  }
                  collapsed={collapseStrokeColorOptions}
                  setCollapsed={setCollapseStrokeColorOptions}
                />

                <ColorOptions
                  type="stroke_color"
                  layerStyle={activeLayer?.properties}
                  active={!!activeLayer?.properties.stroked}
                  layerFields={layerFields}
                  collapsed={collapseStrokeColorOptions}
                  selectedField={activeLayer?.properties.stroke_color_field}
                  onStyleChange={async (newStyle: FeatureLayerProperties) => {
                    if (
                      newStyle.stroke_color_field?.type === "number" &&
                      newStyle.color_scale !== "ordinal"
                    ) {
                      await updateColorClassificationBreaks(
                        "stroke_color",
                        newStyle,
                      );
                    } else if (newStyle.color_scale === "ordinal") {
                      await updateOrdinalValues("stroke_color", newStyle);
                    }
                    updateLayerStyle(newStyle);
                  }}
                  layerId={activeLayer?.layer_id}
                />

                {/* {STROKE WIDTH} */}
                {/* {fix: only for point and line. stroke_width doesn't yet work with polygon due to webgl limitation} */}
                {activeLayer.feature_layer_geometry_type &&
                  ["line", "point"].includes(
                    activeLayer.feature_layer_geometry_type,
                  ) && (
                    <>
                      <Header
                        active={!!activeLayer?.properties.stroked}
                        onToggleChange={(event) => {
                          onToggleChange(event, "stroked");
                        }}
                        alwaysActive={
                          activeLayer?.feature_layer_geometry_type === "line"
                        }
                        label={t("maps:stroke_width")}
                        collapsed={collapseStrokeWidthOptions}
                        setCollapsed={setCollapseStrokeWidthOptions}
                        disableAdvanceOptions={true}
                      />

                      <SizeOptions
                        type="stroke_width"
                        layerStyle={activeLayer?.properties}
                        active={!!activeLayer?.properties.stroked}
                        collapsed={collapseStrokeWidthOptions}
                        onStyleChange={(newStyle: FeatureLayerProperties) => {
                          updateLayerStyle(newStyle);
                        }}
                        layerFields={layerFields}
                        selectedField={
                          activeLayer?.properties["stroke_width_field"]
                        }
                      />
                    </>
                  )}

                {/* {RADIUS} */}
                {activeLayer?.feature_layer_geometry_type &&
                  activeLayer.feature_layer_geometry_type === "point" && (
                    <>
                      <Header
                        active={true}
                        alwaysActive={true}
                        label={t("maps:radius")}
                        collapsed={collapseRadiusOptions}
                        setCollapsed={setCollapseRadiusOptions}
                        disableAdvanceOptions={true}
                      />

                      <SizeOptions
                        type="radius"
                        layerStyle={activeLayer?.properties}
                        active={true}
                        collapsed={collapseRadiusOptions}
                        onStyleChange={(newStyle: FeatureLayerProperties) => {
                          updateLayerStyle(newStyle);
                        }}
                        layerFields={layerFields}
                        selectedField={activeLayer?.properties["radius_field"]}
                      />
                    </>
                  )}

                {/* {LABELS} */}

                <Header
                  active={true}
                  alwaysActive={true}
                  label={t("maps:labels")}
                  collapsed={collapseLabelOptions}
                  setCollapsed={setCollapseLabelOptions}
                />
              </Stack>
            )}
          </Box>
        </>
      }
    />
  );
};

export default LayerStylePanel;
