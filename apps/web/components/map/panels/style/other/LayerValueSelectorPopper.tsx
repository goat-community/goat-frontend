import { Box, Fade, Popper } from "@mui/material";

export function LayerValueSelectorPopper(props: {
  layerId: string;
  fieldName: string;
  selectedValues: string[] | null;
  anchorEl: HTMLElement | null;
  onSelectedValuesChange: (values: string[]) => void;
}) {
  return (
    <Popper
      open={!!props.selectedValues}
      anchorEl={props.anchorEl}
      transition
      sx={{ zIndex: 1200 }}
      placement="left"
      disablePortal
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 115],
          },
        },
      ]}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          <Box sx={{ py: 3, bgcolor: "background.paper", borderRadius: 1 }}>
            {props.selectedValues &&
              props.selectedValues.map((value) => {
                return <Box key={value}>{value}</Box>;
              })}
          </Box>
        </Fade>
      )}
    </Popper>
  );
}
