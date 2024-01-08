import { setActiveLeftPanel } from "@/lib/store/map/slice";
import { useAppDispatch } from "@/hooks/store/ContextHooks";
import Container from "@/components/map/panels/Container";
import { useTranslation } from "@/i18n/client";

interface FilterProps {
  projectId: string;
}

const FilterPanel = (props: FilterProps) => {
  const { projectId } = props;

  const dispatch = useAppDispatch();
  const { t } = useTranslation("maps");

  return (
    <Container
      title={t("panels.filter.filter")}
      close={() => dispatch(setActiveLeftPanel(undefined))}
      body={
        <>
          <div>{projectId}</div>
        </>
      }
    />
  );
};

export default FilterPanel;
