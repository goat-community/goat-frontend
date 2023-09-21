import Container from "@/components/map/panels/Container";
import { Typography } from "@mui/material";

const ChartsPanel = () => {
  return (
    <Container
      header={<Typography variant="h6">Charts</Typography>}
      body={<Typography variant="body1">Body</Typography>}
    />
  );
};

export default ChartsPanel;
