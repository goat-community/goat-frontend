import type { PopperMenuItem } from "@/components/common/PopperMenu";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Typography,
  debounce,
  useTheme,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import SortByMenu from "@/components/common/PopperMenu";
import FilterContentMenu from "@/components/dashboard/common/FilterContent";
import GridViewIcon from "@mui/icons-material/GridView";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useState } from "react";
import type { GetLayersQueryParams, LayerType } from "@/lib/validations/layer";
import type { GetProjectsQueryParams } from "@/lib/validations/project";
import { useTranslation } from "@/i18n/client";

export interface ContentSearchBarProps {
  contentType: "project" | "layer";
  setQueryParams: (
    params: GetLayersQueryParams | GetProjectsQueryParams,
  ) => void;
  queryParams: GetLayersQueryParams | GetProjectsQueryParams;
  view?: "list" | "grid";
  setView?: (view: "list" | "grid") => void;
}

export default function ContentSearchBar(props: ContentSearchBarProps) {
  const { setQueryParams, queryParams, view, setView } = props;
  const theme = useTheme();
  const { t } = useTranslation("dashboard");

  const handleViewToggle = () => {
    const newView = view === "list" ? "grid" : "list";
    setView?.(newView);
  };

  const sortByItems: PopperMenuItem[] = [
    {
      id: "sort-by-alpha-asc",
      label: `A-Z ${t("projects.sort.asc")}`,
      icon: ICON_NAME.SORT_ALPHA_ASC,
    },
    {
      id: "sort-by-alpha-desc",
      label: `A-Z ${t("projects.sort.desc")}`,
      icon: ICON_NAME.SORT_ALPHA_DESC,
    },
    {
      id: "sort-by-last-updated",
      label: t("projects.sort.last_updated"),
      icon: ICON_NAME.CLOCK,
    },
    {
      id: "sort-by-last-created",
      label: t("projects.sort.last_created"),
      icon: ICON_NAME.CLOCK,
    },
  ];

  const [selectedSortBy, setSelectedSortBy] = useState<PopperMenuItem>(
    sortByItems[0],
  );

  const soryByOptions = {
    "sort-by-alpha-asc": { order_by: "name", order: "ascendent" },
    "sort-by-alpha-desc": { order_by: "name", order: "descendent" },
    "sort-by-last-updated": { order_by: "updated_at", order: "descendent" },
    "sort-by-last-created": { order_by: "created_at", order: "descendent" },
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        mt: 2,
      }}
    >
      <Paper
        component="form"
        elevation={3}
        sx={{
          py: 1,
          px: 4,
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Search bar */}
        <Icon iconName={ICON_NAME.SEARCH} style={{ fontSize: 17 }} />
        <InputBase
          sx={{ ml: 3, flex: 1 }}
          placeholder={
            props.contentType === "project"
              ? t("projects.search_projects")
              : t("projects.search_layers")
          }
          inputProps={{ "aria-label": "search projects" }}
          onChange={(e) =>
            debounce(() => {
              setQueryParams({
                ...queryParams,
                search: e.target.value,
              });
            }, 500)()
          }
        />
        <Divider orientation="vertical" flexItem />

        <SortByMenu
          selectedItem={selectedSortBy}
          onSelect={(item: PopperMenuItem) => {
            setSelectedSortBy(item);
            setQueryParams({
              ...queryParams,
              ...soryByOptions[item?.id],
            });
          }}
          menuItems={sortByItems}
          menuButton={
            <Button
              variant="text"
              sx={{
                mx: 2,
                p: 2,
                borderRadius: 1,
              }}
            >
              {selectedSortBy.icon && (
                <Icon iconName={selectedSortBy.icon} style={{ fontSize: 17 }} />
              )}
              <Typography
                variant="body2"
                sx={{ ml: 2, color: theme.palette.primary.main }}
              >
                {selectedSortBy.label}
              </Typography>
            </Button>
          }
        />

        <Divider orientation="vertical" flexItem />
        <FilterContentMenu
          type={props.contentType}
          onLayerTypeSelect={(layerTypes: LayerType[]) => {
            setQueryParams({
              ...queryParams,
              layer_type: layerTypes,
            });
          }}
        />
        {setView && (
          <>
            <Divider orientation="vertical" flexItem />
            <IconButton
              onClick={handleViewToggle}
              sx={{
                ...(view === "grid" && {
                  color: theme.palette.primary.main,
                }),
                ml: 2,
                p: 2,
                borderRadius: 1,
              }}
            >
              <GridViewIcon />
            </IconButton>
            <IconButton
              onClick={handleViewToggle}
              sx={{
                ...(view === "list" && {
                  color: theme.palette.primary.main,
                }),
                ml: 0,
                p: 2,
                borderRadius: 1,
              }}
            >
              <FormatListBulletedIcon />
            </IconButton>
          </>
        )}
      </Paper>
    </Box>
  );
}
