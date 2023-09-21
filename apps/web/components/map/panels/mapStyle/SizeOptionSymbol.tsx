import React, { useState } from "react";
import {
  Slider,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  useTheme
} from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

const SizeOptionSymbol = () => {
  const [value, setValue] = useState<number>(20);

  const theme = useTheme();
  
  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setValue(newValue);
    }
  };

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue)) {
      setValue(newValue);
    }
  };

  return (
    <Box>
      <Accordion>
        <AccordionSummary
          expandIcon={<Icon iconName={ICON_NAME.CHEVRON_DOWN} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{
            padding: "0 16px",
          }}
        >
          <Typography>Color</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: "0 16px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "45px",
            }}
          >
            <TextField
              type="number"
              size="small"
              value={value.toString()}
              onChange={handleTextFieldChange}
            />
            <Slider
              value={value}
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
                },
              }}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SizeOptionSymbol;
