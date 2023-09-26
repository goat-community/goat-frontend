import TileCard from "@/components/dashboard/common/TileCard";
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

interface TileGridProps {
  view: "list" | "grid";
  type: "project" | "layer";
  items: Project[] | Layer[];
  isLoading: boolean;
}

const TileGrid = (props: TileGridProps) => {
  const { items, isLoading } = props;
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

  return (
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
                  props.type === "project" ? ICON_NAME.MAP : ICON_NAME.DATABASE
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
                  createdAt={item.created_at}
                  updatedAt={item.updated_at}
                  id={item.id}
                  contentType={props.type}
                  title={item.name}
                  description={item.description}
                  image={item.thumbnail_url}
                  tags={item.tags}
                />
              )}
            </Grid>
          ),
        )}
      </Grid>
    </Box>
  );
};

export default TileGrid;
