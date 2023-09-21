import Container from "@/components/map/panels/Container";
import { Typography } from "@mui/material";

const ToolboxPanel = () => {
  return (
    <Container
      header={<Typography variant="h6">Toolbox</Typography>}
      body={<Typography variant="body1">Body</Typography>}
    />
  );
};

export default ToolboxPanel;
