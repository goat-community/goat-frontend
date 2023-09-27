import TileCard from "@/components/dashboard/common/TileCard";
import type { Project } from "@/lib/validations/project";
import { Box, Grid, Skeleton } from "@mui/material";

interface ProjectSectionProps {
  projects: Project[];
  isLoading: boolean;
}

const ProjectSection = (props: ProjectSectionProps) => {
  const { projects, isLoading } = props;
  return (
    <Box>
      <Grid container spacing={5}>
        {(isLoading ? Array.from(new Array(4)) : projects ?? []).map(
          (item: Project, index: number) => (
            <Grid
              item
              key={item?.id ?? index}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              display={{
                sm: index > 3 ? "none" : "block",
                md: index > 2 ? "none" : "block",
                lg: index > 3 ? "none" : "block",
              }}
            >
              {!item ? (
                <Skeleton variant="rectangular" height={200} />
              ) : (
                <TileCard
                  cardType="grid"
                  item={item}
                />
              )}
            </Grid>
          ),
        )}
      </Grid>
    </Box>
  );
};

export default ProjectSection;
