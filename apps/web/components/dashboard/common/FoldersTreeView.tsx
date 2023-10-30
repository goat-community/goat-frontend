import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import {
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useFolders } from "@/lib/api/folders";
import { useState } from "react";
import type { SelectedFolderForEdit } from "@/components/modals/Folder";
import type { PopperMenuItem } from "@/components/common/PopperMenu";
import MoreMenu from "@/components/common/PopperMenu";
import type { GetLayersQueryParams } from "@/lib/validations/layer";
import type { GetProjectsQueryParams } from "@/lib/validations/project";
import FolderModal from "@/components/modals/Folder";
import { useTranslation } from "@/i18n/client";

type EditModal = {
  type: "create" | "update" | "delete";
  selectedFolder?: SelectedFolderForEdit;
  open: boolean;
};

export type SelectedFolder = {
  type: "folder" | "team" | "organization";
  id: string;
  name: string;
};

function getIconName(type: string, id: string): ICON_NAME {
  if (type === "team") {
    return ICON_NAME.USERS;
  } else if (type === "organization") {
    return ICON_NAME.ORGANIZATION;
  } else if (type === "folder" && id === "0") {
    return ICON_NAME.HOUSE;
  } else {
    return ICON_NAME.FOLDER;
  }
}

interface FoldersTreeViewProps {
  setQueryParams: (
    params: GetLayersQueryParams | GetProjectsQueryParams,
  ) => void;
  queryParams: GetLayersQueryParams | GetProjectsQueryParams;
}

export default function FoldersTreeView(props: FoldersTreeViewProps) {
  const { setQueryParams, queryParams } = props;
  const [open, setOpen] = useState<boolean[]>([true, false, false]);
  const { t } = useTranslation("dashboard");

  const handleListItemClick = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: SelectedFolder,
  ) => {
    setSelectedFolder(item);
    if (item.id !== "0" && item.type === "folder") {
      setQueryParams({
        ...queryParams,
        folder_id: item.id,
      });
    } else {
      const { folder_id: _, ...rest } = queryParams;
      setQueryParams({
        ...rest,
      });
    }
  };
  const [editModal, setEditModal] = useState<EditModal>();
  const { folders } = useFolders({});
  const teams = [
    {
      id: "1",
      name: "Team_1",
      user_id: "1212",
    },
  ];
  const organizations = [
    {
      id: "2",
      name: "Plan4Better",
      user_id: "1212",
    },
  ];
  const theme = useTheme();

  const folderTypes = ["folder", "team", "organization"];
  const folderTypeTitles = [t("projects.my_content"), t("projects.teams"), t("projects.organizations")];

  const moreMenuItems: PopperMenuItem[] = [
    {
      id: "rename",
      label: t("projects.rename"),
      icon: ICON_NAME.EDIT,
    },
    {
      id: "delete",
      label: t("projects.delete"),
      icon: ICON_NAME.TRASH,
      color: theme.palette.error.main,
    },
  ];
  const [selectedFolder, setSelectedFolder] = useState<SelectedFolder>({
    type: "folder",
    id: "0",
    name: "Home",
  });

  return (
    <>
      <FolderModal
        type={editModal?.type || "create"}
        open={editModal?.open || false}
        onClose={() => {
          setEditModal(undefined);
        }}
        onEdit={() => {
          if (editModal?.type === "delete") {
            setSelectedFolder({
              type: "folder",
              id: "0",
              name: "Home",
            });
          }

          setEditModal(undefined);
        }}
        existingFolderNames={folders?.map((folder) => folder.name)}
        selectedFolder={editModal?.selectedFolder}
      />

      <List
        sx={{ width: "100%", maxWidth: 360 }}
        component="nav"
        aria-labelledby="content-tree-view"
      >
        {[folders ?? [], teams ?? [], organizations ?? []].map(
          (folder, typeIndex) => (
            <div key={typeIndex}>
              <ListItemButton
                disableRipple
                selected={
                  selectedFolder?.type === folderTypes[typeIndex] &&
                  !open[typeIndex]
                }
                onClick={() => {
                  setOpen((prevOpen) => {
                    const newOpen = [...prevOpen];
                    newOpen[typeIndex] = !prevOpen[typeIndex];
                    return newOpen;
                  });
                }}
              >
                {open[typeIndex] ? (
                  <Icon
                    iconName={ICON_NAME.CHEVRON_DOWN}
                    style={{ fontSize: "15px" }}
                  />
                ) : (
                  <Icon
                    iconName={ICON_NAME.CHEVRON_RIGHT}
                    style={{ fontSize: "15px" }}
                  />
                )}

                <ListItemIcon sx={{ ml: 3, minWidth: "40px" }}>
                  <Icon
                    iconName={getIconName(
                      folderTypes[typeIndex],
                      selectedFolder?.id,
                    )}
                    fontSize="small"
                    htmlColor={
                      selectedFolder?.type === folderTypes[typeIndex] &&
                      !open[typeIndex]
                        ? theme.palette.primary.main
                        : "inherit"
                    }
                  />
                </ListItemIcon>
                <ListItemText
                  sx={{
                    "& .MuiTypography-root": {
                      ...(selectedFolder?.type === folderTypes[typeIndex] &&
                        !open[typeIndex] && {
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                        }),
                    },
                  }}
                  primary={
                    <Typography variant="body1">
                      {selectedFolder?.type === folderTypes[typeIndex] &&
                      !open[typeIndex]
                        ? `${folderTypeTitles[typeIndex]} / ${selectedFolder?.name}`
                        : `${folderTypeTitles[typeIndex]}`}
                    </Typography>
                  }
                />
                {typeIndex === 0 && (
                  <Tooltip title={t("projects.new_folder")} placement="top">
                    <IconButton
                      size="small"
                      onClick={(event) => {
                        setEditModal({
                          type: "create",
                          open: true,
                        });
                        event.stopPropagation();
                      }}
                    >
                      <Icon
                        iconName={ICON_NAME.FOLDER_NEW}
                        fontSize="small"
                        htmlColor="inherit"
                      />
                    </IconButton>
                  </Tooltip>
                )}
              </ListItemButton>
              <Collapse in={open[typeIndex]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {(folderTypes[typeIndex] === "folder"
                    ? [{ id: "0", name: "Home", user_id: "0" }]
                    : []
                  )
                    .concat(folder ?? [])
                    .map((item) => (
                      <ListItemButton
                        disableRipple
                        selected={selectedFolder?.id === item.id}
                        onClick={(event) =>
                          handleListItemClick(event, {
                            type: folderTypes[typeIndex] as
                              | "folder"
                              | "team"
                              | "organization",
                            id: item.id,
                            name: item.name,
                          })
                        }
                        sx={{
                          pl: 10,
                          ...(selectedFolder?.id === item.id && {
                            color: theme.palette.primary.main,
                          }),
                        }}
                        key={item.id}
                      >
                        <ListItemIcon sx={{ ml: 4, minWidth: "40px" }}>
                          <Icon
                            iconName={getIconName(
                              folderTypes[typeIndex],
                              item.id,
                            )}
                            fontSize="small"
                            htmlColor={
                              selectedFolder?.id === item.id
                                ? theme.palette.primary.main
                                : "inherit"
                            }
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.name}
                          sx={{
                            "& .MuiTypography-root": {
                              ...(selectedFolder?.id === item.id && {
                                color: theme.palette.primary.main,
                                fontWeight: 700,
                              }),
                            },
                          }}
                        />
                        {folderTypes[typeIndex] === "folder" &&
                          item?.id !== "0" && (
                            <MoreMenu
                              menuItems={moreMenuItems}
                              menuButton={
                                <IconButton size="medium">
                                  <Icon
                                    iconName={ICON_NAME.MORE_VERT}
                                    fontSize="small"
                                  />
                                </IconButton>
                              }
                              onSelect={(menuItem: PopperMenuItem) => {
                                setEditModal({
                                  type:
                                    menuItem.id === "rename"
                                      ? "update"
                                      : "delete",
                                  selectedFolder: {
                                    id: item.id,
                                    name: item.name,
                                  },
                                  open: true,
                                });
                              }}
                            />
                          )}
                      </ListItemButton>
                    ))}
                </List>
              </Collapse>
            </div>
          ),
        )}
      </List>
    </>
  );
}
