import React from "react";
import {
  Slider,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import { setLayerLineWidth } from "@/lib/store/styling/slice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { selectMapLayer } from "@/lib/store/styling/selectors";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

const StrokeOptionLine = () => {
  const mapLayer = useSelector(selectMapLayer);
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      dispatch(setLayerLineWidth({ key: "line-width", val: newValue }));
    }
  };

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = parseFloat(event.target.value);
    if (!isNaN(newValue)) {
      dispatch(setLayerLineWidth({ key: "line-width", val: newValue }));
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
              rowGap: "16px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "16px",
              }}
            >
              <Typography variant="body2">Width</Typography>
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
                  value={mapLayer?.paint?.["line-width"] || 1}
                  onChange={handleTextFieldChange}
                />
                <Slider
                  value={mapLayer?.paint?.["line-width"] || 1}
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
            </Box>
            {/*<Divider sx={{width: "100%",
                            borderTop: "none",
                            borderBottom: `1px solid ${theme.colors.palette.focus 
                        `,}}*/}
            {/*<Box className={classes.optionContainer}>*/}
            {/*  <Typography variant="body2">Style</Typography>*/}
            {/*  <Select size="small" />*/}
            {/*</Box>*/}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default StrokeOptionLine;
