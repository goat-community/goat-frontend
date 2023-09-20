"use client";

import { useProjects } from "@/lib/api/projects";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import BlogSection from "@/components/dashboard/home/BlogSection";
import ProjectSection from "@/components/dashboard/home/ProjectSection";
import DataSection from "@/components/dashboard/home/DataSection";
import { useLayers } from "@/lib/api/layers";
import type { GetContentQueryParams } from "@/lib/validations/common";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";

const Home = () => {
  const queryParams: GetContentQueryParams = {
    order: "descendent",
    order_by: "updated_at",
    size: 4,
  };
  const {
    projects,
    isLoading: isProjectLoading,
    isError: _isProjectError,
  } = useProjects({
    ...queryParams,
  });
  const {
    layers,
    isLoading: isLayerLoading,
    isError: _isLayerError,
  } = useLayers({
    ...queryParams,
  });

  console.log("layers", layers);

  return (
    <Container sx={{ py: 10, px: 10 }} maxWidth="xl">
      <Stack direction="column" spacing={24}>
        <Stack>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Recent Projects</Typography>
            <Button
              variant="text"
              size="small"
              endIcon={
                <Icon
                  iconName={ICON_NAME.CHEVRON_RIGHT}
                  style={{ fontSize: 12 }}
                />
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
          <ProjectSection
            projects={projects?.items ?? []}
            isLoading={isProjectLoading}
          />
        </Stack>
        <DataSection layers={layers?.items ?? []} isLoading={isLayerLoading} />
        <BlogSection />
      </Stack>
    </Container>
  );
};

export default Home;
