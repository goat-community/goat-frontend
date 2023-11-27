import Container from "@/components/map/panels/Container";
import { useAppDispatch } from "@/hooks/store/ContextHooks";
import { setActiveRightPanel } from "@/lib/store/map/slice";
import { Typography } from "@mui/material";

const ScenarioPanel = () => {
  const dispatch = useAppDispatch();
  return (
    <Container
      title="Scenario"
      close={() => dispatch(setActiveRightPanel(undefined))}
      body={<Typography variant="body1">Body</Typography>}
    />
  );
};

export default ScenarioPanel;
