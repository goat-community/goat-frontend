import BasicAccordion from "@p4b/ui/components/BasicAccordion";
import { Slider, TextField } from "@mui/material";
import { makeStyles } from "@/lib/theme";
import Box from "@p4b/ui/components/Box";
import { useSelector } from "react-redux";
import { selectMapLayer } from "@/lib/store/styling/selectors";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setLayerSymbolSize } from "@/lib/store/styling/slice";
import React from "react";

const SizeOptionSymbol = () => {
  const mapLayer = useSelector(selectMapLayer);
  const dispatch = useAppDispatch();

  const { classes } = useStyles();
  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      dispatch(setLayerSymbolSize({ val: newValue }));
    }
  };

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue)) {
      dispatch(setLayerSymbolSize({ val: newValue }));
    }
  };

  return (
    <div>
      <BasicAccordion title="Size" variant="secondary">
        <Box className={classes.optionContainer}>
          <TextField
            type="number"
            size="small"
            value={mapLayer?.layout?.["icon-size"] || 1}
            onChange={handleTextFieldChange}
            inputProps={{
              min: 0.5,
              step: 0.1,
              max: 5,
            }}
          />
          <Slider
            value={mapLayer?.layout?.["icon-size"] || 1}
            onChange={handleSliderChange}
            aria-label="Small"
            valueLabelDisplay="auto"
            color="primary"
            className={classes.slider}
            step={0.1}
            min={0.5}
            max={5}
          />
        </Box>
      </BasicAccordion>
    </div>
  );
};

const useStyles = makeStyles({ name: { SizeOptionSymbol } })((theme) => ({
  optionContainer: {
    display: "flex",
    flexDirection: "column",
    rowGap: "45px",
  },
  slider: {
    "& .MuiSlider-valueLabel": {
      lineHeight: 1.2,
      fontSize: 12,
      background: "unset",
      padding: 0,
      width: 31,
      height: 30,
      backgroundColor: theme.colors.palette.light.main,
      color: theme.colors.palette.focus.main,
    },
  },
}));

export default SizeOptionSymbol;
