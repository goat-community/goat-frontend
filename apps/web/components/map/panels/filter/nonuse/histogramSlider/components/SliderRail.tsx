import React from "react";
import { Box } from "@mui/material";

const trackHeight = 3;
const thumbHeight = 25;

const SliderRail = ({ getRailProps }) => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "#c8ced5",
          width: "100%",
          height: `${trackHeight}px`,
          position: "absolute",
          pointerEvents: "none",
        }}
        {...getRailProps()}
      />
      <Box
        sx={{
          width: "100%",
          height: `${thumbHeight * 2}px`,
          top: `${thumbHeight * -1}px`,
          position: "absolute",
          cursor: "pointer",
        }} />
    </>
  );
};

export default SliderRail;
