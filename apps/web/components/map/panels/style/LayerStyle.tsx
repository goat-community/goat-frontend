import Container from "@/components/map/panels/Container";
import { Box, Stack } from "@mui/material";
import { useDispatch } from "react-redux";
import { useTranslation } from "@/i18n/client";
import { setActiveRightPanel } from "@/lib/store/map/slice";
import ProjectLayerDropdown from "@/components/map/panels/ProjectLayerDropdown";
import { useActiveLayer } from "@/hooks/map/LayerPanelHooks";
import { updateProjectLayer, useProjectLayers } from "@/lib/api/projects";
import type { FeatureLayerProperties } from "@/lib/validations/layer";
import { useCallback, useMemo, useState } from "react";
import { getLayerClassBreaks, useLayerQueryables } from "@/lib/api/layers";
import Header from "@/components/map/panels/style/other/Header";
import ColorOptions from "@/components/map/panels/style/color/ColorOptions";
import SizeOptions from "@/components/map/panels/style/size/SizeOptions";
import type { ProjectLayer } from "@/lib/validations/project";

const LayerStylePanel = ({ projectId }: { projectId: string }) => {
  const { t } = useTranslation(["maps", "common"]);
  const dispatch = useDispatch();
  const activeLayer = useActiveLayer(projectId);
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

  const onToggleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, property: string) => {
      const newStyle =
        JSON.parse(JSON.stringify(activeLayer?.properties)) || {};
      newStyle[property] = event.target.checked;
      updateLayerStyle(newStyle);
    },
    [activeLayer, updateLayerStyle],
  );

  const [collapseFillOptions, setCollapseFillOptions] = useState(true);
  const [collapseStrokeColorOptions, setCollapseStrokeColorOptions] =
    useState(true);
  const [collapseStrokeWidthOptions, setCollapseStrokeWidthOptions] =
    useState(true);
  const [collapseRadiusOptions, setCollapseRadiusOptions] = useState(true);

  return (
    <Container
      title="Layer Style"
      disablePadding={false}
      close={() => dispatch(setActiveRightPanel(undefined))}
      body={
        <>
          {activeLayer && (
            <ProjectLayerDropdown
              projectId={projectId}
              layerTypes={["feature"]}
            />
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
                          await updateColorClassificationBreaks(
                            "color",
                            newStyle,
                          );
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
                    await updateColorClassificationBreaks(
                      "stroke_color",
                      newStyle,
                    );
                    updateLayerStyle(newStyle);
                  }}
                  layerId={activeLayer?.layer_id}
                />

                {/* {STROKE WIDTH} */}
                <Header
                  active={!!activeLayer?.properties.stroked}
                  onToggleChange={(event) => {
                    onToggleChange(event, "stroked");
                  }}
                  alwaysActive={
                    activeLayer?.feature_layer_geometry_type === "line"
                  }
                  label={
                    ["line", "polygon"].includes(
                      activeLayer?.feature_layer_geometry_type || "",
                    )
                      ? t("maps:stroke_width")
                      : t("maps:outline")
                  }
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
                  selectedField={activeLayer?.properties["stroke_width_field"]}
                />

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
              </Stack>
            )}
          </Box>
        </>
      }
    />
  );
};

export default LayerStylePanel;
