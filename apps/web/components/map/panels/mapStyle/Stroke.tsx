import React, { useState } from "react";
import BasicAccordion from "@p4b/ui/components/BasicAccordion";
import {
  Box,
  Divider,
  Select,
  Slider,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

const Stroke = () => {
  const [width, setWidth] = useState<number>(20);
  
  const theme = useTheme();
  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setWidth(newValue);
    }
  };

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue)) {
      setWidth(newValue);
    }
  };

  return (
    <div>
      <BasicAccordion title="Stroke" variant="secondary">
        <Box sx={{ display: "flex", flexDirection: "column", rowGap: "16px" }}>
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "16px",
          }}>
            <Typography variant="body2">Width</Typography>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "45px",
            }}>
              <TextField
                type="number"
                size="small"
                value={width.toString()}
                onChange={handleTextFieldChange}
              />
              <Slider
                value={width}
                onChange={handleSliderChange}
                aria-label="Small"
                valueLabelDisplay="auto"
                color="primary"
                sx={{
                  "& .MuiSlider-valueLabel": {
                    lineHeight: 1.2,
                    fontSize: 12,
                    background: "unset",
                    padding: 0,
                    width: 31,
                    height: 30,
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.primary.main,
                  }
                }}
              />
            </Box>
          </Box>
          <Divider sx={{
            width: "100%",
            borderTop: "none",
            borderBottom: `1px solid ${theme.palette.secondary.main}`,
          }} />
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "16px",
          }}>
            <Typography variant="body2">Style</Typography>
            <Select size="small" />
          </Box>
        </Box>
      </BasicAccordion>
    </div>
  );
};

export default Stroke;
