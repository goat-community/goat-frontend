import Container from "@/components/map/panels/Container";
import type { MapSidebarItem } from "@/types/map/sidebar";
import ToolTabs from "@/components/map/panels/toolbox/tools/ToolTabs";

interface ToolboxPanelProps {
  setActiveRight: (item: MapSidebarItem | undefined) => void;
}

const ToolboxPanel = (props: ToolboxPanelProps) => {
  const { setActiveRight } = props;

  return (
    <Container
      title="Toolbox"
      close={setActiveRight}
      body={<ToolTabs/>}
    />
  );
};

export default ToolboxPanel;
