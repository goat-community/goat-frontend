import React from "react";
import { Slider, Rail, Handles, Tracks } from "react-compound-slider";
import SliderRail from "./components/SliderRail";
import SliderHandle from "./components/SliderHandle";
import SliderTracks from "./components/SliderTracks";
import { Box } from "@mui/material";

const RangeSlider = ({ domain, values, step, mode, onUpdate, onChange }) => {
  const handleUpdate = data => {
    onUpdate(data);
  };
  const handleChange = data => {
    onChange(data);
  };

  return (
    <Box sx={{
      position: "relative",
      width: "100%",
    }}>
      <Slider
        mode={mode}
        step={step}
        domain={domain}
        onUpdate={handleUpdate}
        onChange={handleChange}
        values={values}
      >
        <Rail>
          {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
        </Rail>
        <Handles>
          {({ handles, getHandleProps }) => (
            <>
              {handles.map(handle => (
                <SliderHandle
                  key={handle.id}
                  handle={handle}
                  domain={domain}
                  getHandleProps={getHandleProps}
                />
              ))}
            </>
          )}
        </Handles>
        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <>
              {tracks.map(({ id, source, target }) => (
                <SliderTracks
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </>
          )}
        </Tracks>
      </Slider>
    </Box>
  );
};

RangeSlider.defaultProps = {
  domain: [],
  values: [],
  step: 1,
  mode: 2,
  onUpdate: () => {},
  onChange: () => {}
};

export default RangeSlider;
