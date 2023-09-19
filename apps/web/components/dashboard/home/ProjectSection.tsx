import SectionCard from "@/components/dashboard/home/SectionCard";
import type { Project } from "@/lib/validations/project";
import {
  Box,
  Button,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";

interface ProjectSectionProps {
  projects: Project[];
  isLoading: boolean;
}

const ProjectSection = (props: ProjectSectionProps) => {
  const { projects, isLoading } = props;
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Recent Projects</Typography>
        <Button
          variant="text"
          size="small"
          endIcon={
            <Icon iconName={ICON_NAME.CHEVRON_RIGHT} style={{ fontSize: 12 }} />
          }
          href="/projects"
          sx={{
            borderRadius: 0,
          }}
        >
          See All
        </Button>
      </Box>
      <Divider sx={{ mb: 4 }} />
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
                <SectionCard
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

export default ProjectSection;
