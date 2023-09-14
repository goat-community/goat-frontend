import BasicAccordion from "@p4b/ui/components/BasicAccordion";
import { makeStyles } from "@/lib/theme";
import Box from "@p4b/ui/components/Box";
import { TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setLayerFillColor } from "@/lib/store/styling/slice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { selectMapLayer } from "@/lib/store/styling/selectors";
import { useDebounce } from "@/hooks/useDebounce";

const ColorOptionLine = () => {
  const mapLayer = useSelector(selectMapLayer);

  const [lineFillColor, setLineFillColor] = useState<string>(
    mapLayer?.paint?.["line-color"] || "",
  );

  const { classes } = useStyles();
  const dispatch = useAppDispatch();

  const lineFillColorDebounce = useDebounce(lineFillColor, 100);

  const handleLineFillColorChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setLineFillColor(event.target.value);
  };

  useEffect(() => {
    dispatch(
      setLayerFillColor({ key: "line-color", val: lineFillColorDebounce }),
    );
  }, [lineFillColorDebounce, dispatch]);

  return (
    <BasicAccordion title="Color" variant="secondary">
      <Box className={classes.root}>
        <Box className={classes.colorContainer}>
          <Typography variant="body1">Fill</Typography>
          <Box className={classes.inputsContainer}>
            <TextField
              type="color"
              size="small"
              className={classes.inputs}
              value={lineFillColor}
              onChange={handleLineFillColorChange}
            />
          </Box>
        </Box>
      </Box>
    </BasicAccordion>
  );
};

const useStyles = makeStyles({ name: { ColorOptionLine } })(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    rowGap: "16px",
  },
  colorContainer: {
    display: "flex",
    flexDirection: "column",
    rowGap: "8px",
  },
  inputsContainer: {
    display: "flex",
    columnGap: "4px",
  },
  inputs: {
    width: "50%",
    "& .MuiInputBase-root": {
      height: "32px",
      padding: "2px 8px",
    },
    input: {
      padding: "unset",
      height: "100%",
    },
  },
}));

export default ColorOptionLine;
