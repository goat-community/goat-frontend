"use client";

import { useProjects } from "@/lib/api/projects";
import { Container, Stack } from "@mui/material";
import React from "react";
import BlogSection from "@/components/dashboard/home/BlogSection";
import ProjectSection from "@/components/dashboard/home/ProjectSection";
import ContentSection from "@/components/dashboard/home/ContentSection";

const Home = () => {
  const {
    projects,
    isLoading,
    isError: _isError,
  } = useProjects({
    order: "descendent",
  });

  return (
    <Container sx={{ py: 20, px: 10 }} maxWidth="xl">
      <Stack direction="column" spacing={24}>
        <ProjectSection
          projects={projects?.items ?? []}
          isLoading={isLoading}
        />
        <ContentSection />
        <BlogSection />
      </Stack>
    </Container>
  );
};

export default Home;
