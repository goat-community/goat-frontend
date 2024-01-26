import React from "react";
import { Box, useTheme } from "@mui/material";

const thumbHeight = 15;

const SliderHandle = ({
  domain: [min, max],
  handle: { id, value, percent },
  getHandleProps,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        marginLeft: `${thumbHeight * -0.5}px`,
        marginTop: `${thumbHeight * -0.5}px`,
        width: `${thumbHeight}px`,
        height: `${thumbHeight}px`,
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: "50%",
        whiteSpace: "nowrap",
        position: "absolute",
        zIndex: 2,
        cursor: "pointer",
      }}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      style={{ left: `${percent}%` }}
      {...getHandleProps(id)}
    />
  );
};

export default SliderHandle;
