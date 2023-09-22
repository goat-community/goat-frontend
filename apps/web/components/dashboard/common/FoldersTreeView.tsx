import { TreeView } from "@mui/x-tree-view/TreeView";
import TreeViewItem from "@/components/common/TreeViewItem";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { IconButton, Tooltip } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { useFolders } from "@/lib/api/folders";
import { useState } from "react";

export default function FoldersTreeView() {
  const [selected, setSelected] = useState<string[]>(["0"]);
  const { folders } = useFolders({});

  const handleNodeSelect = (_event, nodeIds: string[]) => {
    setSelected(nodeIds);
  };

  return (
    <TreeView
      aria-label="content-tree-view"
      defaultExpanded={["0"]}
      defaultCollapseIcon={
        <Icon iconName={ICON_NAME.CHEVRON_DOWN} fontSize="small" />
      }
      defaultExpandIcon={
        <Icon iconName={ICON_NAME.CHEVRON_RIGHT} fontSize="small" />
      }
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{ height: "100%", flexGrow: 1, overflowY: "auto" }}
      selected={selected}
      onNodeSelect={handleNodeSelect}
    >
      <TreeViewItem
        nodeId="0"
        labelText="Home"
        labelIcon={
          <Icon
            iconName={ICON_NAME.HOUSE}
            fontSize="small"
            htmlColor="inherit"
          />
        }
        actionElement={
          <Tooltip title="New Folder" placement="top">
            <IconButton
              size="small"
              onClick={(event) => {
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
        }
      >
        {folders?.items?.map((folder) => (
          <TreeViewItem
            key={folder.id}
            nodeId={folder.id}
            labelText={folder.name}
            labelIcon={
              <Icon
                iconName={ICON_NAME.FOLDER}
                fontSize="small"
                htmlColor="inherit"
              />
            }
            actionElement={
              <IconButton
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <Icon
                  iconName={ICON_NAME.MORE_VERT}
                  fontSize="small"
                  htmlColor="inherit"
                />
              </IconButton>
            }
          />
        ))}
      </TreeViewItem>
      {/* TEAMS SECTION */}
      <TreeViewItem nodeId="1" labelText="Teams" labelIcon={<GroupIcon />} />
      {/* ORGANIZATION SECTION */}
      <TreeViewItem
        nodeId="2"
        labelText="Organization"
        labelIcon={<Icon iconName={ICON_NAME.ORGANIZATION} fontSize="small" />}
      />
    </TreeView>
  );
}
