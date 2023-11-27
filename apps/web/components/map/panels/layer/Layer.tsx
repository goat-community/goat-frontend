import Container from "@/components/map/panels/Container";

import { useMemo, useState } from "react";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import {
  useTheme,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Card,
  Grid,
  IconButton,
  styled,
  Typography,
  Stack,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "@/i18n/client";

import type { PopperMenuItem } from "@/components/common/PopperMenu";
import MoreMenu from "@/components/common/PopperMenu";
import type { ChangeEvent } from "react";
import type { MapSidebarItem } from "@/types/map/sidebar";
import {
  addProjectLayers,
  deleteProjectLayer,
  updateProject,
  updateProjectLayer,
  useProject,
  useProjectLayers,
} from "@/lib/api/projects";
import React from "react";
import { DragIndicator } from "@mui/icons-material";
import type { Layer as MapLayer } from "@/lib/validations/layer";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useLayerSettingsMoreMenu } from "@/hooks/map/LayerPanelHooks";
import { toast } from "react-toastify";

interface PanelProps {
  onCollapse?: () => void;
  setActiveLeft: (item: MapSidebarItem | undefined) => void;
  projectId: string;
}

const StyledDragHandle = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.text.secondary,
  opacity: 0,
  ":hover": {
    cursor: "move",
    color: theme.palette.text.primary,
  },
}));

export const DragHandle: React.FC<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listeners?: any;
  children?: React.ReactNode;
}> = ({ listeners, children }) => (
  <StyledDragHandle {...(listeners ? listeners : {})}>
    {children}
  </StyledDragHandle>
);

type SortableLayerTileProps = {
  id: number;
  layer: MapLayer;
  actions?: React.ReactNode;
};

export function SortableLayerTile(props: SortableLayerTileProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });
  const { t } = useTranslation("maps");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      sx={{
        cursor: "pointer",
        my: 2,
        pr: 0,
        pl: 1,
        py: 2,
        ":hover": {
          boxShadow: 6,
          "& div": {
            opacity: 1,
          },
        },
      }}
      key={props.id}
      ref={setNodeRef}
      style={style}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={1}>
          <DragHandle {...attributes} listeners={listeners}>
            <DragIndicator fontSize="small" />
          </DragHandle>
        </Grid>
        <Grid item xs={8} zeroMinWidth>
          <Stack spacing={1}>
            <Typography variant="caption" noWrap>
              {t(`maps:${props.layer.type}`)}
            </Typography>
            <Typography variant="body2" fontWeight="bold" noWrap>
              {props.layer.name}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={3}>
          {props.actions}
        </Grid>
      </Grid>
    </Card>
  );
}

const LayerPanel = ({ setActiveLeft, projectId }: PanelProps) => {
  const theme = useTheme();
  const { t } = useTranslation("maps");
  const { layers: projectLayers, mutate: mutateProjectLayers } =
    useProjectLayers(projectId);

  const { project, mutate: mutateProject } = useProject(projectId);
  const sortedLayers = useMemo(() => {
    if (!projectLayers || !project) return [];
    return projectLayers.sort(
      (a, b) =>
        project?.layer_order.indexOf(a.id) - project.layer_order.indexOf(b.id),
    );
  }, [projectLayers, project]);

  const [searchString, setSearchString] = useState<string>("");
  function changeSearch(text: string) {
    setSearchString(text);
  }

  const {
    layerMoreMenuOptions,
    // activeLayer,
    // moreMenuState,
    // closeMoreMenu,
    openMoreMenu,
  } = useLayerSettingsMoreMenu();

  async function toggleLayerVisibility(layer: MapLayer) {
    const layers = JSON.parse(JSON.stringify(projectLayers));
    const index = layers.findIndex((l) => l.id === layer.id);
    const layerToUpdate = layers[index];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let properties = layerToUpdate.properties as any;
    if (!properties) {
      properties = {};
    }
    if (!properties?.layout) {
      properties.layout = {};
    }
    properties.layout.visibility =
      !properties.layout.visibility ||
      properties.layout.visibility === "visible"
        ? "none"
        : "visible";

    layerToUpdate.properties = properties;
    await mutateProjectLayers(layers, false);
    await updateProjectLayer(projectId, layer.id, layerToUpdate);
  }
  async function handleDragEnd(event) {
    if (!project) return;
    const { active, over } = event;
    const projectToUpdate = JSON.parse(JSON.stringify(project));
    const layerOrder = projectToUpdate.layer_order;
    const oldIndex = layerOrder.indexOf(active.id);

    const newIndex = layerOrder.indexOf(over.id);
    const newOrderArray = arrayMove(layerOrder, oldIndex, newIndex);
    const updatedProject = {
      ...projectToUpdate,
      layer_order: newOrderArray,
    };
    if (projectLayers) {
      const oldLayer = projectLayers.find((l) => l.id === active.id);
      const newLayer = projectLayers.find((l) => l.id === over.id);
      if (oldLayer && newLayer) {
        // force a re-render of the map layers (can find a better way to do this later)
        oldLayer.updated_at = new Date().toISOString();
        newLayer.updated_at = new Date().toISOString() + "1";
      }
    }
    try {
      mutateProject(updatedProject, false);
      await updateProject(projectId, updatedProject);
    } catch (error) {
      toast.error("Error updating project layer order");
    }
  }

  async function deleteLayer(layer: MapLayer) {
    try {
      await deleteProjectLayer(projectId, layer.id);
      mutateProjectLayers(projectLayers?.filter((l) => l.id !== layer.id));
    } catch (error) {
      toast.error("Error removing layer from project");
    }
  }

  async function duplicateLayer(layer: MapLayer) {
    try {
      await addProjectLayers(projectId, [layer.layer_id]);
      mutateProjectLayers();
    } catch (error) {
      toast.error("Error duplicating layer");
    }
  }

  return (
    <Container
      title="Layers"
      close={setActiveLeft}
      direction="left"
      body={
        <>
          <Box>
            <FormControl
              sx={{ width: "100%", marginBottom: theme.spacing(3) }}
              variant="outlined"
              size="small"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                {t("search")}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <Icon
                      iconName={ICON_NAME.SEARCH}
                      fontSize="small"
                      htmlColor={`${theme.palette.secondary.light}aa`}
                    />
                  </InputAdornment>
                }
                value={searchString}
                onChange={(
                  e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                ) => changeSearch(e.target.value)}
                label={t("search")}
              />
            </FormControl>
          </Box>
          <Box>
            {sortedLayers && sortedLayers?.length > 0 && (
              <DndContext
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
                autoScroll={false}
              >
                <SortableContext
                  items={sortedLayers.map((layer) => layer.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sortedLayers?.map((layer) => (
                    <SortableLayerTile
                      key={layer.id}
                      id={layer.id}
                      layer={layer}
                      actions={
                        <Stack direction="row">
                          <Tooltip
                            key={layer.id}
                            title={
                              layer.properties?.layout?.visibility === "none"
                                ? t("show_layer")
                                : t("hide_layer")
                            }
                            arrow
                            placement="top"
                          >
                            <IconButton
                              size="small"
                              onClick={() => toggleLayerVisibility(layer)}
                            >
                              <Icon
                                iconName={
                                  layer.properties?.layout?.visibility ===
                                  "none"
                                    ? ICON_NAME.EYE_SLASH
                                    : ICON_NAME.EYE
                                }
                                style={{ fontSize: 15 }}
                              />
                            </IconButton>
                          </Tooltip>
                          <MoreMenu
                            menuItems={layerMoreMenuOptions}
                            menuButton={
                              <Tooltip
                                title={t("layer_more_options")}
                                arrow
                                placement="top"
                              >
                                <IconButton size="small">
                                  <Icon
                                    iconName={ICON_NAME.MORE_VERT}
                                    style={{ fontSize: 15 }}
                                  />
                                </IconButton>
                              </Tooltip>
                            }
                            onSelect={async (menuItem: PopperMenuItem) => {
                              if (menuItem.id === "delete") {
                                await deleteLayer(layer);
                              } else if (menuItem.id === "duplicate") {
                                await duplicateLayer(layer);
                              } else {
                                console.log("Selected menu item", menuItem);
                                openMoreMenu(menuItem, layer);
                              }
                            }}
                          />
                        </Stack>
                      }
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </Box>
        </>
      }
    />
  );
};

export default LayerPanel;
