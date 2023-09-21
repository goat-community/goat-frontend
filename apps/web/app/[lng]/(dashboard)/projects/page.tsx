"use client";

import {
  Box,
  Button,
  Container,
  IconButton,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import GridViewIcon from "@mui/icons-material/GridView";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useState } from "react";
import { useProjects } from "@/lib/api/projects";
import TileGrid from "@/components/dashboard/common/TileGrid";

const Projects = () => {
  const {
    projects,
    isLoading: isProjectLoading,
    isError: _isProjectError,
  } = useProjects({});

  const [view, setView] = useState<"list" | "grid">("grid");
  const handleViewToggle = () => {
    const newView = view === "list" ? "grid" : "list";
    setView(newView);
  };

  return (
    <Container sx={{ py: 10, px: 10 }} maxWidth="xl">
      {/* {Header} */}
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
      {/* Search bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          mt: 2,
          mb: 8,
        }}
      >
        <Paper
          component="form"
          elevation={0}
          sx={{
            py: 1,
            px: 4,
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Icon
            iconName={ICON_NAME.SEARCH}
            fontSize="small"
            style={{ fontSize: 12 }}
          />
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Search Projects"
            inputProps={{ "aria-label": "search projects" }}
          />
        </Paper>
        <IconButton
          sx={{
            ml: 2,
            p: 2,
            borderRadius: 1,
          }}
        >
          <Icon iconName={ICON_NAME.FILTER} fontSize="small" />
        </IconButton>
        <IconButton
          onClick={handleViewToggle}
          sx={{
            mx: 2,
            p: 2,
            borderRadius: 1,
          }}
        >
          {view === "list" ? <GridViewIcon /> : <FormatListBulletedIcon />}
        </IconButton>
      </Box>

      <TileGrid
        view={view}
        items={projects?.items ?? []}
        isLoading={isProjectLoading}
        type="project"
      />
    </Container>
  );
};

export default Projects;
