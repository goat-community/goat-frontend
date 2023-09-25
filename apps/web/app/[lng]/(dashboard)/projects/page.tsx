"use client";

import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useState } from "react";
import { useProjects } from "@/lib/api/projects";
import TileGrid from "@/components/dashboard/common/TileGrid";
import FoldersTreeView from "@/components/dashboard/common/FoldersTreeView";
import type { GetProjectsQueryParams } from "@/lib/validations/project";
import ContentSearchBar from "@/components/dashboard/common/ContentSearchbar";

const Projects = () => {
  const [queryParams, setQueryParams] = useState<GetProjectsQueryParams>({
    order: "descendent",
    order_by: "updated_at",
  });
  const [view, setView] = useState<"list" | "grid">("grid");

  const {
    projects,
    isLoading: isProjectLoading,
    isError: _isProjectError,
  } = useProjects(queryParams);

  return (
    <Container sx={{ py: 10, px: 10 }} maxWidth="xl">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 8,
        }}
      >
        <Typography variant="h6">Projects</Typography>
        <Button
          disableElevation={true}
          startIcon={
            <Icon iconName={ICON_NAME.PLUS} style={{ fontSize: 12 }} />
          }
          href="/projects"
        >
          New project
        </Button>
      </Box>
      <Grid container justifyContent="space-between" spacing={4}>
        <Grid item xs={12}>
          <ContentSearchBar
            contentType="project"
            view={view}
            setView={setView}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
          />
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{ backgroundImage: "none" }}>
            <FoldersTreeView
              queryParams={queryParams}
              setQueryParams={setQueryParams}
            />
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <TileGrid
            view={view}
            items={projects?.items ?? []}
            isLoading={isProjectLoading}
            type="project"
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Projects;
