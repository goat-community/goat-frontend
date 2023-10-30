import TileCard from "@/components/dashboard/common/TileCard";
import ContentDialogWrapper from "@/components/modals/ContentDialogWrapper";
import { useContentMoreMenu } from "@/hooks/dashboard/ContentHooks";
import type { Layer } from "@/lib/validations/layer";
import type { Project } from "@/lib/validations/project";
import type { ContentActions } from "@/types/common";
import {
  Box,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useTranslation } from "@/i18n/client";

interface TileGridProps {
  view: "list" | "grid";
  type: "project" | "layer";
  items: Project[] | Layer[];
  isLoading: boolean;
}

const TileGrid = (props: TileGridProps) => {
  const { items, isLoading } = props;
  const theme = useTheme();
  const { t } = useTranslation("dashboard");
  const listProps = {
    xs: 12,
  };
  const gridProps = {
    xs: 12,
    sm: 6,
    md: 4,
    lg: 3,
  };

  const {
    moreMenuOptions,
    activeContent,
    moreMenuState,
    closeMoreMenu,
    openMoreMenu,
  } = useContentMoreMenu();

  return (
    <>
      {activeContent && moreMenuState && (
        <>
          <ContentDialogWrapper
            content={activeContent}
            action={moreMenuState.id as ContentActions}
            onClose={closeMoreMenu}
            onContentDelete={closeMoreMenu}
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
                    ? t("projects.no_projects_found")
                    : t("projects.no_datasets_found")}
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
                    onMoreMenuSelect={openMoreMenu}
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
