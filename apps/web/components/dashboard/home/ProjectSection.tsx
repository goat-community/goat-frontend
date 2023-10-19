import EmptyCard from "@/components/dashboard/common/EmptyCard";
import TileCard from "@/components/dashboard/common/TileCard";
import ContentDialogWrapper from "@/components/modals/ContentDialogWrapper";
import ProjectModal from "@/components/modals/Project";
import { useContentMoreMenu } from "@/hooks/dashboard/ContentHooks";
import type { Project } from "@/lib/validations/project";
import type { ContentActions } from "@/types/common";
import { Box, Grid, Skeleton } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "@/i18n/client";

interface ProjectSectionProps {
  projects: Project[];
  lng: string;
  isLoading: boolean;
}

const ProjectSection = (props: ProjectSectionProps) => {
  const router = useRouter();
  const { projects, isLoading, lng } = props;
  const {
    moreMenuOptions,
    activeContent,
    moreMenuState,
    closeMoreMenu,
    openMoreMenu,
  } = useContentMoreMenu();

  const {t} = useTranslation(lng, "dashboard");
  const [openProjectModal, setOpenProjectModal] = useState(false);
  return (
    <Box>
      <ProjectModal
        type="create"
        open={openProjectModal}
        onClose={() => setOpenProjectModal(false)}
      />
      {activeContent && moreMenuState && (
        <>
          <ContentDialogWrapper
            content={activeContent}
            action={moreMenuState.id as ContentActions}
            onClose={closeMoreMenu}
            onContentDelete={closeMoreMenu}
            type="project"
          />
        </>
      )}
      <Grid container spacing={5}>
        {(isLoading ? Array.from(new Array(3)) : projects ?? []).map(
          (item: Project, index: number) => (
            <Grid
              item
              key={item?.id ?? index}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              onClick={() => {
                if (item && item.id) {
                  router.push(`/map/${item.id}`);
                }
              }}
              display={{
                sm: index > 2 ? "none" : "block",
                md: index > 1 ? "none" : "block",
                lg: index > 2 ? "none" : "block",
              }}
            >
              {!item ? (
                <Skeleton variant="rectangular" height={200} />
              ) : (
                <TileCard
                  cardType="grid"
                  item={item}
                  moreMenuOptions={moreMenuOptions}
                  onMoreMenuSelect={openMoreMenu}
                />
              )}
            </Grid>
          ),
        )}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={200} />
          ) : (
            <EmptyCard
              onClick={() => {
                setOpenProjectModal(true);
              }}
              tooltip={t("home.create_new_project")}
              backgroundImage="https://assets.plan4better.de/img/goat_new_project_artwork.png"
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProjectSection;
