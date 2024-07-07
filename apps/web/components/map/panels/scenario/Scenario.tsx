import EmptySection from "@/components/common/EmptySection";
import { OverflowTypograpy } from "@/components/common/OverflowTypography";
import Container from "@/components/map/panels/Container";
import { SortableTile } from "@/components/map/panels/common/SortableTile";
import ScenarioModal from "@/components/modals/ScenarioModal";
import { useAppDispatch } from "@/hooks/store/ContextHooks";
import { useTranslation } from "@/i18n/client";
import { deleteProjectScenario, useProjectScenarios } from "@/lib/api/projects";
import { setActiveRightPanel } from "@/lib/store/map/slice";
import type { PopperMenuItem } from "@/components/common/PopperMenu";
import MoreMenu from "@/components/common/PopperMenu";
import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useState } from "react";
import { ScenarioActions } from "@/types/common";
import ConfirmModal from "@/components/modals/Confirm";
import { toast } from "react-toastify";
import { Trans } from "react-i18next";
import type { Scenario } from "@/lib/validations/scenario";
import ToolsHeader from "@/components/map/panels/common/ToolsHeader";
import ScenarioFeaturesEditor from "@/components/map/panels/scenario/ScenarioFeaturesEditor";

const CreateScenarioAction = ({
  projectId,
  onDone,
}: {
  projectId: string;
  onDone: () => void;
  editType?: "edit" | "create";
}) => {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Stack spacing={4} sx={{ width: "100%" }}>
        <Stack direction="row" spacing={2} alignItems="center" />
        <Button
          onClick={() => setOpen(true)}
          fullWidth
          size="small"
          startIcon={
            <Icon iconName={ICON_NAME.PLUS} style={{ fontSize: "15px" }} />
          }
        >
          <Typography variant="body2" fontWeight="bold" color="inherit">
            {t("common:create_scenario")}
          </Typography>
        </Button>
      </Stack>
      <ScenarioModal
        open={open}
        projectId={projectId}
        onClose={() => {
          setOpen(false);
          onDone();
        }}
        scenario={undefined}
      />
    </>
  );
};

const ScenarioPanel = ({ projectId }: { projectId: string }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");

  const { scenarios, mutate, isLoading } = useProjectScenarios(projectId);
  const [confirmDeleteScenarioDialogOpen, setConfirmDeleteScenarioDialogOpen] =
    useState(false);
  const [isEditScenarioMetadataModalOpen, setIsEditScenarioMetadataModalOpen] =
    useState(false);

  const [selectedScenario, setSelectedScenario] = useState<
    Scenario | undefined
  >(undefined);

  const [editingScenario, setEditingScenario] = useState<Scenario | undefined>(
    undefined,
  );

  // TODO: Active Scenario should be handled in the project config object
  const [activeScenario, setActiveScenario] = useState<Scenario | undefined>(
    undefined,
  );

  const scenarioOptions: PopperMenuItem[] = [
    {
      id: ScenarioActions.EDIT,
      label: t("edit"),
      icon: ICON_NAME.SCENARIO,
    },
    {
      id: ScenarioActions.EDIT_METADATA,
      label: t("rename"),
      icon: ICON_NAME.EDIT,
    },
    {
      id: ScenarioActions.DELETE,
      label: t("delete"),
      icon: ICON_NAME.TRASH,
      color: "error.main",
    },
  ];

  async function deleteScenario() {
    try {
      if (!selectedScenario) return;
      await deleteProjectScenario(projectId, selectedScenario?.id);
      toast.success(t("scenario_deleted_success"));
    } catch (error) {
      console.error(error);
      toast.error(t("error_deleting_scenario"));
    } finally {
      setSelectedScenario(undefined);
      setConfirmDeleteScenarioDialogOpen(false);
    }
  }

  return (
    <Container
      title={editingScenario ? undefined : t("scenarios")}
      header={
        !editingScenario ? undefined : (
          <ToolsHeader
            title={`${t("scenario")} ${activeScenario?.name || ""}`}
            onBack={() => {
              setEditingScenario(undefined);
            }}
          />
        )
      }
      close={() => dispatch(setActiveRightPanel(undefined))}
      body={
        <>
          {!editingScenario && (
            <>
              {/* Delete Scenario Confirmation */}
              <ConfirmModal
                open={confirmDeleteScenarioDialogOpen}
                title={t("delete_scenario")}
                body={
                  <Trans
                    i18nKey="common:delete_scenario_confirmation"
                    values={{ scenario: selectedScenario?.name }}
                    components={{ b: <b /> }}
                  />
                }
                onClose={() => {
                  setSelectedScenario(undefined);
                  setConfirmDeleteScenarioDialogOpen(false);
                }}
                onConfirm={async () => {
                  setConfirmDeleteScenarioDialogOpen(true);
                  await deleteScenario();
                  mutate();
                }}
                closeText={t("close")}
                confirmText={t("delete")}
              />
              {/* Scenario Edit Modal */}
              {isEditScenarioMetadataModalOpen && (
                <ScenarioModal
                  open={isEditScenarioMetadataModalOpen}
                  projectId={projectId}
                  onClose={() => {
                    setIsEditScenarioMetadataModalOpen(false);
                    setSelectedScenario(undefined);
                    mutate();
                  }}
                  scenario={selectedScenario}
                  editType="edit"
                />
              )}

              {scenarios?.items?.map((scenario) => (
                <SortableTile
                  key={scenario.id}
                  id={scenario.id}
                  active={activeScenario?.id === scenario.id}
                  onClick={() => {
                    setActiveScenario(scenario);
                  }}
                  body={
                    <>
                      <OverflowTypograpy
                        variant="body2"
                        fontWeight="bold"
                        tooltipProps={{
                          placement: "bottom",
                          arrow: true,
                        }}
                      >
                        {scenario.name}
                      </OverflowTypograpy>
                    </>
                  }
                  isSortable={false}
                  actions={
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      sx={{ pr: 2 }}
                    >
                      <MoreMenu
                        disablePortal
                        menuItems={scenarioOptions}
                        onSelect={async (menuItem: PopperMenuItem) => {
                          if (menuItem.id === ScenarioActions.DELETE) {
                            setSelectedScenario(scenario);
                            setConfirmDeleteScenarioDialogOpen(true);
                          } else if (
                            menuItem.id === ScenarioActions.EDIT_METADATA
                          ) {
                            setSelectedScenario(scenario);
                            setIsEditScenarioMetadataModalOpen(true);
                          } else if (menuItem.id === ScenarioActions.EDIT) {
                            setEditingScenario(scenario);
                            setActiveScenario(scenario);
                          }
                        }}
                        menuButton={
                          <Tooltip
                            title={t("more_options")}
                            arrow
                            placement="top"
                          >
                            <IconButton size="small">
                              <Icon
                                iconName={ICON_NAME.MORE_VERT}
                                style={{ fontSize: 15 }}
                              />
                            </IconButton>
                          </Tooltip>
                        }
                      />
                    </Stack>
                  }
                />
              ))}

              {!isLoading && scenarios?.items?.length === 0 && (
                <EmptySection
                  label={t("no_scenarios_created")}
                  icon={ICON_NAME.SCENARIO}
                />
              )}
            </>
          )}

          {editingScenario && (
            <ScenarioFeaturesEditor scenario={editingScenario} projectId={projectId} />
          )}
        </>
      }
      action={
        !editingScenario && (
          <CreateScenarioAction
            projectId={projectId}
            onDone={() => {
              mutate();
            }}
          />
        )
      }
    />
  );
};

export default ScenarioPanel;
