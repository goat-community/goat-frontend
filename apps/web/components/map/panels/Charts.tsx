import Container from "@/components/map/panels/Container";
import { useAppDispatch } from "@/hooks/store/ContextHooks";
import { setActiveLeftPanel } from "@/lib/store/map/slice";
import { Typography } from "@mui/material";

const ChartsPanel = () => {
  const dispatch = useAppDispatch();
  return (
    <Container
      close={() => dispatch(setActiveLeftPanel(undefined))}
      title="Charts"
      direction="left"
      body={<Typography variant="body1">Body</Typography>}
    />
  );
};

export default ChartsPanel;
