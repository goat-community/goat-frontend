import React from "react";
import { Box, useTheme } from "@mui/material";

const trackHeight = 3;
const thumbHeight = 25;

const SliderRail = ({ source, target, getTrackProps }) => {
  const left = `${source.percent}%`;
  const width = `${target.percent - source.percent}%`;

  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          height: `${trackHeight}px`,
          position: "absolute",
          zIndex: 1,
          pointerEvents: "none",
          left: left,
          width: width,
        }}
        left={left}
        width={width}
      />
      <Box
        sx={{
          height: `${thumbHeight}px`,
          top: `${thumbHeight * -0.5}px`,
          position: "absolute",
          cursor: "pointer",
          left: left,
          width: width,
        }}
        {...getTrackProps()}
      />
    </>
  );
};

// SliderRail.propTypes = {
//   source: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     value: PropTypes.number.isRequired,
//     percent: PropTypes.number.isRequired,
//   }).isRequired,
//   target: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     value: PropTypes.number.isRequired,
//     percent: PropTypes.number.isRequired,
//   }).isRequired,
//   getTrackProps: PropTypes.func.isRequired,
// };

export default SliderRail;
