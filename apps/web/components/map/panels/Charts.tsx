import Container from "@/components/map/panels/Container";
import { Typography } from "@mui/material";
import type { MapSidebarItem } from "@/types/map/sidebar";

interface ChartsPanelProps {
  setActiveLeft: (item: MapSidebarItem | undefined) => void;
}

const ChartsPanel = (props: ChartsPanelProps) => {
  return (
    <Container
      close={props.setActiveLeft}
      title="Charts"
      direction="left"
      body={<Typography variant="body1">Body</Typography>}
    />
  );
};

export default ChartsPanel;
