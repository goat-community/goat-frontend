import EmptySection from "@/components/common/EmptySection";
import Container from "@/components/map/panels/Container";
import { useAppDispatch } from "@/hooks/store/ContextHooks";
import { useTranslation } from "@/i18n/client";
import { setActiveRightPanel } from "@/lib/store/map/slice";
import { ICON_NAME } from "@p4b/ui/components/Icon";

const ScenarioPanel = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");
  return (
    <Container
      title="Scenario"
      close={() => dispatch(setActiveRightPanel(undefined))}
      body={
        <EmptySection label={t("coming_soon")} icon={ICON_NAME.COMING_SOON} />
      }
    />
  );
};

export default ScenarioPanel;
