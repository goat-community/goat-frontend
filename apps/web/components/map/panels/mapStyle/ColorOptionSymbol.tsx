import {
  Divider,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  useTheme
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/hooks/store/ContextHooks";

const ColorOptionSymbol = () => {
  const mapLayer = useSelector(selectMapLayer);
  
  const theme = useTheme();
  
  const dispatch = useAppDispatch();

  const handleFillColorChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    console.log("value", event.target.value);
    // dispatch(setLayerFillColor(event.target.value));
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
                  value={mapLayer?.paint?.["fill-color"]}
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
                  value={mapLayer?.paint?.["fill-outline-color"]}
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
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ColorOptionSymbol;