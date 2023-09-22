"use client";

import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import GridViewIcon from "@mui/icons-material/GridView";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useState } from "react";
import { useProjects } from "@/lib/api/projects";
import TileGrid from "@/components/dashboard/common/TileGrid";
import FoldersTreeView from "@/components/dashboard/common/FoldersTreeView";

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
  const theme = useTheme();

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
      <Grid container justifyContent="space-between" spacing={4}>
        <Grid item xs={12}>
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
                placeholder="Search Projects"
                inputProps={{ "aria-label": "search projects" }}
              />
              <Divider orientation="vertical" flexItem />
              <IconButton
                sx={{
                  mx: 2,
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <Icon iconName={ICON_NAME.FILTER} fontSize="small" />
              </IconButton>
              <Divider orientation="vertical" flexItem />

              <IconButton
                onClick={handleViewToggle}
                sx={{
                  ml: 2,
                  p: 2,
                  borderRadius: 1,
                }}
              >
                {view === "list" ? (
                  <GridViewIcon />
                ) : (
                  <FormatListBulletedIcon />
                )}
              </IconButton>
            </Paper>
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Paper elevation={3} sx={{backgroundImage: 'none'}}>
            <FoldersTreeView />
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
