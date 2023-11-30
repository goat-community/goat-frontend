import Container from "@/components/map/panels/Container";
import { Typography, Button } from "@mui/material";
import { setActiveLeftPanel } from "@/lib/store/map/slice";
import { useAppDispatch } from "@/hooks/store/ContextHooks";

const LegendPanel = () => {
  const dispatch = useAppDispatch();

  return (
    <Container
      title="Legend"
      close={() => dispatch(setActiveLeftPanel(undefined))}
      direction="left"
      body={<Typography variant="body1">Body</Typography>}
      action={<Button variant="contained">Action</Button>}
    />
  );
};

export default LegendPanel;
