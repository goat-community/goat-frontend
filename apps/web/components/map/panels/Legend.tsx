import Container from "@/components/map/panels/Container";
import {Typography, Button} from "@mui/material";

const LegendPanel = () => {
  return (
    <Container
      header={<Typography variant="h6">Legend</Typography>}
      body={<Typography variant="body1">Body</Typography>}
      action={<Button variant="contained">Action</Button>}
    />
  );
};

export default LegendPanel;
