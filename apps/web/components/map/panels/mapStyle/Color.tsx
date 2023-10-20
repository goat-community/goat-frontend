import { Divider, TextField, Typography, useTheme, Box } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLayerFillColor,
  setLayerFillOutLineColor,
} from "@/lib/store/styling/slice";
import { selectMapLayer } from "@/lib/store/styling/selectors";
import BasicAccordion from "@p4b/ui/components/BasicAccordion";

const Color = () => {
  const mapLayer = useSelector(selectMapLayer);

  const theme = useTheme();
  const dispatch = useDispatch();

  const handleFillColorChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(setLayerFillColor({ key: "fill-color", val: event.target.value }));
  };

  const handleStrokeColorChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(setLayerFillOutLineColor(event.target.value));
  };

  // const handleFillOpacityChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   setFillOpacity(event.target.value);
  // };

  // const handleStrokeOpacityChange = (
  //   esvent: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   setStrokeOpacity(event.target.value);
  // };

  return (
    <BasicAccordion title="Color" variant="secondary">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: "16px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "8px",
          }}
        >
          <Typography variant="body1">Fill</Typography>
          <Box
            sx={{
              display: "flex",
              columnGap: "4px",
            }}
          >
            <TextField
              type="color"
              size="small"
              sx={{
                width: "50%",
                "& .MuiInputBase-root": {
                  height: "32px",
                  padding: "2px 8px",
                },
                input: {
                  padding: "unset",
                  height: "100%",
                },
              }}
              value={mapLayer?.paint ? mapLayer?.paint["fill-color"] : "#000"}
              onChange={handleFillColorChange}
            />
            {/*<TextField*/}
            {/*  type="number"*/}
            {/*  size="small"*/}
            {/*  className={classes.inputs}*/}
            {/*  value={fillOpacity}*/}
            {/*  onChange={handleFillOpacityChange}*/}
            {/*/>*/}
          </Box>
        </Box>
        <Divider
          sx={{
            width: "100%",
            borderTop: "none",
            borderBottom: `1px solid ${theme.palette.primary.main}`,
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "8px",
          }}
        >
          <Typography variant="body1">Stroke</Typography>
          <Box
            sx={{
              display: "flex",
              columnGap: "4px",
            }}
          >
            <TextField
              type="color"
              size="small"
              sx={{
                width: "50%",
                "& .MuiInputBase-root": {
                  height: "32px",
                  padding: "2px 8px",
                },
                input: {
                  padding: "unset",
                  height: "100%",
                },
              }}
              value={
                mapLayer?.paint ? mapLayer?.paint["fill-outline-color"] : "#000"
              }
              onChange={handleStrokeColorChange}
            />
            {/*<TextField*/}
            {/*  type="number"*/}
            {/*  size="small"*/}
            {/*  className={classes.inputs}*/}
            {/*  value={strokeOpacity}*/}
            {/*  onChange={handleStrokeOpacityChange}*/}
            {/*/>*/}
          </Box>
        </Box>
      </Box>
    </BasicAccordion>
  );
};
export default Color;
