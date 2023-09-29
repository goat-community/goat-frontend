import type { PopperMenuItem } from "@/components/common/PopperMenu";
import TileCard from "@/components/dashboard/common/TileCard";
import DeleteContentModal from "@/components/modals/DeleteContent";
import EditMetadataModal from "@/components/modals/EditMetadata";
import type { Layer } from "@/lib/validations/layer";
import type { Project } from "@/lib/validations/project";
import {
  Box,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useState } from "react";

interface TileGridProps {
  view: "list" | "grid";
  type: "project" | "layer";
  items: Project[] | Layer[];
  isLoading: boolean;
}

export const moreMenuOptions: PopperMenuItem[] = [
  {
    label: "Info",
    icon: ICON_NAME.CIRCLEINFO,
  },
  {
    label: "Edit metadata",
    icon: ICON_NAME.EDIT,
  },
  {
    label: "Move to folder",
    icon: ICON_NAME.FOLDER,
  },
  {
    label: "Download",
    icon: ICON_NAME.DOWNLOAD,
  },
  {
    label: "Share",
    icon: ICON_NAME.SHARE,
  },
  {
    label: "Delete",
    icon: ICON_NAME.TRASH,
    color: "error.main",
  },
];

const TileGrid = (props: TileGridProps) => {
  const { items, isLoading } = props;
  const [activeContent, setActiveContent] = useState<Project | Layer>();
  const theme = useTheme();
  const listProps = {
    xs: 12,
  };
  const gridProps = {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 3,
  };

  const [moreMenuState, setMoreMenuState] = useState<boolean[]>(
    new Array(moreMenuOptions.length).fill(false) as boolean[],
  );

  const closeMoreMenu = () => {
    setActiveContent(undefined);
    setMoreMenuState(
      new Array(moreMenuOptions.length).fill(false) as boolean[],
    );
  };

  return (
    <>
      {activeContent && (
        <>
          <EditMetadataModal
            open={moreMenuState[1]}
            onClose={closeMoreMenu}
            content={activeContent}
            type={props.type}
          />
          <DeleteContentModal
            open={moreMenuState[5]}
            onClose={closeMoreMenu}
            onDelete={closeMoreMenu}
            content={activeContent}
            type={props.type}
          />
        </>
      )}

      <Box
        sx={{
          ...(props.view === "list" && {
            boxShadow: 3,
          }),
        }}
      >
        <Grid container spacing={props.view === "list" ? 0 : 5}>
          {!isLoading && items?.length === 0 && (
            <Grid item xs={12}>
              <Stack
                direction="column"
                spacing={4}
                sx={{
                  mt: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Icon
                  iconName={
                    props.type === "project"
                      ? ICON_NAME.MAP
                      : ICON_NAME.DATABASE
                  }
                  htmlColor={theme.palette.text.secondary}
                />
                <Typography variant="h6" color={theme.palette.text.secondary}>
                  {props.type === "project"
                    ? "No projects found"
                    : "No datasets found"}
                </Typography>
              </Stack>
            </Grid>
          )}
          {(isLoading ? Array.from(new Array(4)) : items ?? []).map(
            (item: Project | Layer, index: number) => (
              <Grid
                item
                key={item?.id ?? index}
                {...(props.view === "list" ? listProps : gridProps)}
              >
                {!item ? (
                  <Skeleton
                    variant="rectangular"
                    height={props.view === "list" ? 80 : 200}
                  />
                ) : (
                  <TileCard
                    cardType={props.view}
                    item={item}
                    moreMenuOptions={moreMenuOptions}
                    onMoreMenuSelect={(
                      optionIndex: number,
                      item: Project | Layer,
                    ) => {
                      setActiveContent(item);
                      setMoreMenuState(
                        moreMenuState.map((_, i) => i === optionIndex),
                      );
                    }}
                  />
                )}
              </Grid>
            ),
          )}
        </Grid>
      </Box>
    </>
  );
};

export default TileGrid;
