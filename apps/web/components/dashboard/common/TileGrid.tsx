import TileCard from "@/components/dashboard/common/TileCard";
import type { Layer } from "@/lib/validations/layer";
import type { Project } from "@/lib/validations/project";
import { Box, Grid, Skeleton } from "@mui/material";

interface TileGridProps {
  view: "list" | "grid";
  type: "project" | "layer";
  items: Project[] | Layer[];
  isLoading: boolean;
}

const TileGrid = (props: TileGridProps) => {
  const { items, isLoading } = props;

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
    <Box>
      <Grid container spacing={props.view === "list" ? 0 : 5}>
        {(isLoading ? Array.from(new Array(4)) : items ?? []).map(
          (item: Project, index: number) => (
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
                  contentType="project"
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
