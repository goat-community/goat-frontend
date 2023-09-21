import React from "react";
import { useSelector } from "react-redux";
import { setLayerFillColor } from "@/lib/store/styling/slice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { selectMapLayer } from "@/lib/store/styling/selectors";
import {
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

const ColorOptionLine = () => {
  const mapLayer = useSelector(selectMapLayer);

  const dispatch = useAppDispatch();

  const handleFillColorChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(setLayerFillColor({ key: "line-color", val: event.target.value }));
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
                  value={mapLayer?.paint?.["line-color"]}
                  onChange={handleFillColorChange}
                />
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ColorOptionLine;
