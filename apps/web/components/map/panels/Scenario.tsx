import Container from "@/components/map/panels/Container";
import { Typography } from "@mui/material";

const ScenarioPanel = () => {
  return (
    <Container header={<Typography variant="h6">Scenario</Typography>} body={<Typography variant="body1">Body</Typography>} />
  );
};

export default ScenarioPanel;
