"use client";

import { useProjects } from "@/lib/api/projects";
import { Container, Stack } from "@mui/material";
import React from "react";
import BlogSection from "@/components/dashboard/home/BlogSection";
import ProjectSection from "@/components/dashboard/home/ProjectSection";
import LayerSection from "@/components/dashboard/home/LayerSection";
import { useLayers } from "@/lib/api/layers";
import type { GetContentQueryParams } from "@/lib/validations/common";

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
    <Container sx={{ py: 20, px: 10 }} maxWidth="xl">
      <Stack direction="column" spacing={24}>
        <ProjectSection
          projects={projects?.items ?? []}
          isLoading={isProjectLoading}
        />
        <LayerSection layers={layers?.items ?? []} isLoading={isLayerLoading} />
        <BlogSection />
      </Stack>
    </Container>
  );
};

export default Home;
