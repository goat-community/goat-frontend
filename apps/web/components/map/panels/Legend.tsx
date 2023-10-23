import Container from "@/components/map/panels/Container";
import { Typography, Button } from "@mui/material";
import type { MapSidebarItem } from "@/types/map/sidebar";

interface LegendPanelProps {
  setActiveLeft: (item: MapSidebarItem | undefined) => void;
}

const LegendPanel = (props: LegendPanelProps) => {
  const { setActiveLeft } = props;

  return (
    <Container
      title="Legend"
      close={setActiveLeft}
      direction="left"
      body={<Typography variant="body1">Body</Typography>}
      action={<Button variant="contained">Action</Button>}
    />
  );
};

export default LegendPanel;
