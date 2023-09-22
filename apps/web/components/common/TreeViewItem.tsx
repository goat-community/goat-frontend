import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import clsx from "clsx";

import type {
  TreeItemContentProps,
  TreeItemProps,
} from "@mui/x-tree-view/TreeItem";
import {
  TreeItem,
  treeItemClasses,
  useTreeItem,
} from "@mui/x-tree-view/TreeItem";
import { useTheme } from "@mui/material";

type StyledTreeItemProps = TreeItemProps & {
  labelIcon: JSX.Element;
  labelInfo?: string;
  labelText: string;
  actionElement?: JSX.Element;
};

const CustomContent = React.forwardRef(function CustomContent(
  props: TreeItemContentProps,
  ref,
) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    preventSelection(event);
  };

  const handleExpansionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    handleSelection(event);
  };

  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Box
        component="div"
        className={classes.label}
        onClick={handleSelectionClick}
        sx={{
          display: "flex",
          alignItems: "center",
          py: 2,
          pr: 1,
        }}
      >
        {label}
      </Box>
    </div>
  );
});

const StyledTreeItem = React.forwardRef(function StyledTreeItem(
  props: StyledTreeItemProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const { labelIcon, labelInfo, labelText, actionElement, ...other } = props;
  const theme = useTheme();
  return (
    <TreeItem
      ContentComponent={CustomContent}
      sx={{
        [`& .${treeItemClasses.content}`]: {
          "&.Mui-selected, &.Mui-selected.Mui-focused": {
            fontWeight: 700,
            color: theme.palette.primary.main,
          },
          [`& .${treeItemClasses.label}`]: {
            fontWeight: "inherit",
            color: "inherit",
          },
          "& .MuiTreeItem-iconContainer": {
            mr: 3,
            ml: 1,
          },
        },
        [`& .${treeItemClasses.group}`]: {
          marginLeft: 0,
          [`& .${treeItemClasses.content}`]: {
            paddingLeft: 6,
          },
        },
      }}
      label={
        <>
          <Box
            color="inherit"
            sx={{ mr: 4, py: 2, display: "inherit", color: "inherit" }}
          >
            {labelIcon}
          </Box>
          <Typography
            variant="body1"
            sx={{ fontWeight: "inherit", flexGrow: 1, color: "inherit" }}
          >
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
          {actionElement}
        </>
      }
      {...other}
      ref={ref}
    />
  );
});

export default StyledTreeItem;
