import Container from "@/components/map/panels/Container";
import { Typography } from "@mui/material";
import type { MapSidebarItem } from "@/types/map/sidebar";

interface ScenarioPanelProps {
  setActiveRight: (item: MapSidebarItem | undefined) => void;
}

const ScenarioPanel = (props: ScenarioPanelProps) => {
  const { setActiveRight } = props;

  return (
    <Container
      title="Scenario"
      close={setActiveRight}
      body={<Typography variant="body1">Body</Typography>}
    />
  );
};

export default ScenarioPanel;
