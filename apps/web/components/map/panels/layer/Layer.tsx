import Container from "@/components/map/panels/Container";

import { useState } from "react";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import {
  useTheme,
  Box,
  Card,
  Grid,
  IconButton,
  Typography,
  Stack,
  Tooltip,
  TextField,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  MenuList,
  ClickAwayListener,
} from "@mui/material";
import { useTranslation } from "@/i18n/client";

import type { PopperMenuItem } from "@/components/common/PopperMenu";
import MoreMenu from "@/components/common/PopperMenu";
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
import type { ProjectLayer } from "@/lib/validations/project";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  useLayerSettingsMoreMenu,
  useSortedLayers,
} from "@/hooks/map/LayerPanelHooks";
import { toast } from "react-toastify";
import { ContentActions, MapLayerActions } from "@/types/common";
import { useAppDispatch, useAppSelector } from "@/hooks/store/ContextHooks";
import { setActiveLayer } from "@/lib/store/layer/slice";
import { useMap } from "react-map-gl";
import { zoomToLayer } from "@/lib/utils/map/navigate";
import { OverflowTypograpy } from "@/components/common/OverflowTypography";
import { setActiveLeftPanel, setActiveRightPanel } from "@/lib/store/map/slice";
import { MapSidebarItemID } from "@/types/map/common";
import DatasetUploadModal from "@/components/modals/DatasetUpload";
import DatasetExplorerModal from "@/components/modals/DatasetExplorer";
import { DragHandle } from "@/components/common/DragHandle";
import ContentDialogWrapper from "@/components/modals/ContentDialogWrapper";

interface PanelProps {
  onCollapse?: () => void;
  projectId: string;
}

type SortableLayerTileProps = {
  id: number;
  layer: ProjectLayer;
  active: boolean;
  onClick: () => void;
  actions?: React.ReactNode;
  body: React.ReactNode;
};

export function SortableLayerTile(props: SortableLayerTileProps) {
  const theme = useTheme();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: `${transition}, border-color 0.2s ease-in-out`,
  };

  return (
    <Card
      onClick={props.onClick}
      sx={{
        cursor: "pointer",
        my: 2,
        pr: 0,
        pl: 1,
        borderLeft: props.active
          ? `5px ${theme.palette.primary.main} solid`
          : "5px transparent solid",
        py: 2,
        ":hover": {
          boxShadow: 6,
          ...(!props.active && {
            borderLeft: `5px ${theme.palette.text.secondary} solid`,
          }),
          "& div, & button": {
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
          <Stack spacing={1}>{props.body}</Stack>
        </Grid>
        <Grid item xs={3}>
          {props.actions}
        </Grid>
      </Grid>
    </Card>
  );
}

enum AddLayerSourceType {
  DatasourceExplorer,
  DatasourceUpload,
  DataSourceExternal,
}

const AddLayerSection = ({ projectId }: { projectId: string }) => {
  const { t } = useTranslation("maps");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [addLayerSourceOpen, setAddSourceOpen] =
    useState<AddLayerSourceType | null>(null);
  const openAddLayerSourceDialog = (addType: AddLayerSourceType) => {
    handleClose();
    setAddSourceOpen(addType);
  };

  const closeAddLayerSourceModal = () => {
    setAddSourceOpen(null);
  };

  return (
    <>
      <Stack spacing={4} sx={{ width: "100%" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Icon iconName={ICON_NAME.DATABASE} style={{ fontSize: "15px" }} />
          <Typography variant="body2" fontWeight="bold" color="inherit">
            {t("maps:source")}
          </Typography>
        </Stack>
        <Button
          onClick={handleClick}
          fullWidth
          size="small"
          startIcon={
            <Icon iconName={ICON_NAME.PLUS} style={{ fontSize: "15px" }} />
          }
        >
          <Typography variant="body2" fontWeight="bold" color="inherit">
            {t("maps:add_layer")}
          </Typography>
        </Button>
        <Menu
          anchorEl={anchorEl}
          sx={{
            "& .MuiPaper-root": {
              boxShadow: "0px 0px 10px 0px rgba(58, 53, 65, 0.1)",
            },
          }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          transformOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={open}
          MenuListProps={{
            "aria-labelledby": "basic-button",
            sx: { width: anchorEl && anchorEl.offsetWidth - 10, p: 0 },
          }}
          onClose={handleClose}
        >
          <Box>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList>
                <MenuItem
                  onClick={() =>
                    openAddLayerSourceDialog(
                      AddLayerSourceType.DatasourceExplorer,
                    )
                  }
                >
                  <ListItemIcon>
                    <Icon
                      iconName={ICON_NAME.DATABASE}
                      style={{ fontSize: "15px" }}
                    />
                  </ListItemIcon>
                  <Typography variant="body2">Dataset Explorer</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    openAddLayerSourceDialog(
                      AddLayerSourceType.DatasourceUpload,
                    )
                  }
                >
                  <ListItemIcon>
                    <Icon
                      iconName={ICON_NAME.UPLOAD}
                      style={{ fontSize: "15px" }}
                    />
                  </ListItemIcon>
                  <Typography variant="body2">Dataset Upload</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    openAddLayerSourceDialog(
                      AddLayerSourceType.DataSourceExternal,
                    )
                  }
                >
                  <ListItemIcon>
                    <Icon
                      iconName={ICON_NAME.LINK}
                      style={{ fontSize: "15px" }}
                    />
                  </ListItemIcon>
                  <Typography variant="body2">Dataset External</Typography>
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Box>
        </Menu>
      </Stack>
      {addLayerSourceOpen === AddLayerSourceType.DatasourceExplorer && (
        <DatasetExplorerModal
          open={true}
          onClose={closeAddLayerSourceModal}
          projectId={projectId}
        />
      )}
      {addLayerSourceOpen === AddLayerSourceType.DatasourceUpload && (
        <DatasetUploadModal open={true} onClose={closeAddLayerSourceModal} />
      )}
    </>
  );
};

const LayerPanel = ({ projectId }: PanelProps) => {
  const { t } = useTranslation("maps");
  const { map } = useMap();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [previousRightPanel, setPreviousRightPanel] = useState<
    MapSidebarItemID | undefined
  >(undefined);
  const { layers: projectLayers, mutate: mutateProjectLayers } =
    useProjectLayers(projectId);

  const activeLayerId = useAppSelector((state) => state.layers.activeLayerId);
  const activeRightPanel = useAppSelector(
    (state) => state.map.activeRightPanel,
  );

  const { project, mutate: mutateProject } = useProject(projectId);
  const sortedLayers = useSortedLayers(projectId);

  const [renameLayer, setRenameLayer] = useState<ProjectLayer | undefined>(
    undefined,
  );
  const [newLayerName, setNewLayerName] = useState<string>("");
  const {
    layerMoreMenuOptions,
    openMoreMenu,
    closeMoreMenu,
    moreMenuState,
    activeLayer: activeLayerMoreMenu,
  } = useLayerSettingsMoreMenu();
  async function toggleLayerVisibility(layer: ProjectLayer) {
    const layers = JSON.parse(JSON.stringify(projectLayers));
    const index = layers.findIndex((l) => l.id === layer.id);
    const layerToUpdate = layers[index];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let properties = layerToUpdate.properties as any;
    if (!properties) {
      properties = {};
    }

    properties.visibility = !properties.visibility;

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

  async function deleteLayer(layer: ProjectLayer) {
    try {
      await deleteProjectLayer(projectId, layer.id);
      mutateProjectLayers(projectLayers?.filter((l) => l.id !== layer.id));
      if (layer.id === activeLayerId) {
        dispatch(setActiveLayer(null));
      }
    } catch (error) {
      toast.error("Error removing layer from project");
    }
  }

  async function duplicateLayer(layer: ProjectLayer) {
    try {
      await addProjectLayers(projectId, [layer.layer_id]);
      mutateProjectLayers();
    } catch (error) {
      toast.error("Error duplicating layer");
    }
  }

  async function renameLayerName(layer: ProjectLayer) {
    try {
      setRenameLayer(undefined);
      const udpatedProjectLayers = JSON.parse(JSON.stringify(projectLayers));
      const index = udpatedProjectLayers.findIndex((l) => l.id === layer.id);
      udpatedProjectLayers[index].name = newLayerName;
      mutateProjectLayers(udpatedProjectLayers, false);
      await updateProjectLayer(
        projectId,
        layer.id,
        udpatedProjectLayers[index],
      );
    } catch (error) {
      toast.error("Error renaming layer");
    } finally {
      setNewLayerName("");
    }
  }

  function openPropertiesPanel(layer: ProjectLayer) {
    if (layer.id !== activeLayerId) {
      dispatch(setActiveLayer(layer.id));
    }
    dispatch(setActiveRightPanel(MapSidebarItemID.PROPERTIES));
  }

  return (
    <Container
      title="Layers"
      close={() => dispatch(setActiveLeftPanel(undefined))}
      direction="left"
      body={
        <>
          {moreMenuState?.id === ContentActions.DOWNLOAD &&
            activeLayerMoreMenu && (
              <>
                <ContentDialogWrapper
                  content={activeLayerMoreMenu}
                  action={moreMenuState.id as ContentActions}
                  onClose={closeMoreMenu}
                  onContentDelete={closeMoreMenu}
                  type="layer"
                />
              </>
            )}
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
                      active={activeLayerId === layer.id}
                      onClick={() => {
                        const rightPanelIds = [
                          MapSidebarItemID.PROPERTIES,
                          MapSidebarItemID.FILTER,
                          MapSidebarItemID.STYLE,
                        ];
                        const isActiveRightPanelInIds =
                          activeRightPanel &&
                          rightPanelIds.includes(activeRightPanel);

                        dispatch(setActiveLayer(layer.id));
                        setPreviousRightPanel(undefined);

                        if (
                          layer.id === activeLayerId &&
                          isActiveRightPanelInIds
                        ) {
                          setPreviousRightPanel(activeRightPanel);
                          dispatch(setActiveRightPanel(undefined));
                        }

                        if (layer.id !== activeLayerId) {
                          if (activeRightPanel && !isActiveRightPanelInIds) {
                            setActiveRightPanel(undefined);
                          }

                          if (previousRightPanel) {
                            dispatch(setActiveRightPanel(previousRightPanel));
                          }
                        }
                      }}
                      layer={layer}
                      body={
                        <>
                          <Typography variant="caption" noWrap>
                            {t(`maps:${layer.type}`)}
                          </Typography>

                          {renameLayer?.id === layer.id ? (
                            <TextField
                              autoFocus
                              variant="standard"
                              size="small"
                              inputProps={{
                                style: {
                                  fontSize: "0.875rem",
                                  fontWeight: "bold",
                                },
                              }}
                              defaultValue={renameLayer.name}
                              onChange={(e) => {
                                setNewLayerName(e.target.value);
                              }}
                              onBlur={async () => {
                                if (
                                  newLayerName !== "" &&
                                  layer.name !== newLayerName
                                ) {
                                  await renameLayerName(layer);
                                } else {
                                  setNewLayerName("");
                                  setRenameLayer(undefined);
                                }
                              }}
                            />
                          ) : (
                            <OverflowTypograpy
                              variant="body2"
                              fontWeight="bold"
                              tooltipProps={{
                                placement: "bottom",
                                arrow: true,
                              }}
                            >
                              {layer.name}
                            </OverflowTypograpy>
                          )}
                        </>
                      }
                      actions={
                        <Stack direction="row">
                          <Tooltip
                            key={layer.id}
                            title={
                              layer.properties.visibility
                                ? t("show_layer")
                                : t("hide_layer")
                            }
                            arrow
                            placement="top"
                          >
                            <IconButton
                              size="small"
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleLayerVisibility(layer);
                              }}
                              sx={{
                                transition: theme.transitions.create(
                                  ["opacity"],
                                  {
                                    duration:
                                      theme.transitions.duration.standard,
                                  },
                                ),
                                opacity: !layer.properties.visibility ? 1 : 0,
                              }}
                            >
                              <Icon
                                iconName={
                                  !layer.properties.visibility
                                    ? ICON_NAME.EYE_SLASH
                                    : ICON_NAME.EYE
                                }
                                style={{
                                  fontSize: 15,
                                }}
                              />
                            </IconButton>
                          </Tooltip>
                          <MoreMenu
                            menuItems={layerMoreMenuOptions}
                            menuButton={
                              <Tooltip
                                title={t("more_options")}
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
                              if (menuItem.id === MapLayerActions.PROPERTIES) {
                                openPropertiesPanel(layer);
                              } else if (
                                menuItem.id === ContentActions.DELETE
                              ) {
                                await deleteLayer(layer);
                              } else if (
                                menuItem.id === MapLayerActions.DUPLICATE
                              ) {
                                await duplicateLayer(layer);
                              } else if (
                                menuItem.id === MapLayerActions.RENAME
                              ) {
                                setRenameLayer(layer);
                              } else if (
                                menuItem.id === MapLayerActions.ZOOM_TO
                              ) {
                                zoomToLayer(map, layer.extent);
                              } else {
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
      action={<AddLayerSection projectId={projectId} />}
    />
  );
};

export default LayerPanel;
