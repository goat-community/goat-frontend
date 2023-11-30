import Container from "@/components/map/panels/Container";
import ToolTabs from "@/components/map/panels/toolbox/tools/ToolTabs";
import { useAppDispatch } from "@/hooks/store/ContextHooks";
import { setActiveRightPanel } from "@/lib/store/map/slice";

const ToolboxPanel = () => {
  const dispatch = useAppDispatch();
  return (
    <Container
      title="Toolbox"
      close={() => dispatch(setActiveRightPanel(undefined))}
      body={<ToolTabs />}
    />
  );
};

export default ToolboxPanel;
