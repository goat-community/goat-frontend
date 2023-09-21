import {
  FormControl,
  MenuItem,
  Select,
  Typography,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";

import React from "react";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

const MarkerOptionSymbol = () => {
  const theme = useTheme();
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
          <FormControl sx={{ m: 1, width: "100%" }}>
            <Select
              size="small"
              sx={{
                "& .MuiSelect-select": {
                  display: "flex",
                  columnGap: "8px",
                  alignItems: "center",
                },
              }}
            >
              <MenuItem
                value="icon"
                sx={{
                  display: "flex",
                  columnGap: "8px",
                  alignItems: "center",
                }}
              >
                <Icon
                  iconName={ICON_NAME.STAR}
                  htmlColor={theme.palette.primary.main}
                  fontSize="small"
                />
                <Typography variant="body2">Icon</Typography>
              </MenuItem>
              <MenuItem
                value="shape"
                sx={{ display: "flex", columnGap: "8px", alignItems: "center" }}
              >
                <Icon
                  iconName={ICON_NAME.CIRCLE}
                  htmlColor={theme.palette.primary.main}
                  fontSize="small"
                />
                <Typography variant="body2">Shape</Typography>
              </MenuItem>
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default MarkerOptionSymbol;
