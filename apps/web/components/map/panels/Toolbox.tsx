import Container from "@/components/map/panels/Container";
import { Typography } from "@mui/material";
import type { MapSidebarItem } from "@/types/map/sidebar";

interface ToolboxPanelProps {
  setActiveRight: (item: MapSidebarItem | undefined) => void;
}

const ToolboxPanel = (props: ToolboxPanelProps) => {
  const { setActiveRight } = props;

  return (
    <Container
      title="Toolbox"
      close={setActiveRight}
      body={<Typography variant="body1">Body</Typography>}
    />
  );
};

export default ToolboxPanel;
