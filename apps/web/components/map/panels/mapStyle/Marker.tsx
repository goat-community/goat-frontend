import { FormControl, MenuItem, Select, Typography, useTheme } from "@mui/material";
import BasicAccordion from "@p4b/ui/components/BasicAccordion";

import React from "react";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

const Marker = () => {
  const theme = useTheme();
  
  return (
    <BasicAccordion title="Marker" variant="secondary">
      <FormControl sx={{ m: 1, width: "100%" }}>
        <Select size="small" sx={{
          "& .MuiSelect-select": {
            display: "flex",
            columnGap: "8px",
            alignItems: "center",
          },
        }}>
          <MenuItem value="icon" sx={{
            display: "flex",
            columnGap: "8px",
            alignItems: "center",
          }}>
            <Icon
              iconName={ICON_NAME.STAR}
              htmlColor={theme.palette.primary.main}
              fontSize="small"
            />
            <Typography variant="body2">Icon</Typography>
          </MenuItem>
          <MenuItem value="shape" sx={{
            display: "flex",
            columnGap: "8px",
            alignItems: "center",
          }}>
            <Icon
              iconName={ICON_NAME.CIRCLE}
              htmlColor={theme.palette.primary.main}
              fontSize="small"
            />
            <Typography variant="body2">Shape</Typography>
          </MenuItem>
        </Select>
      </FormControl>
    </BasicAccordion>
  );
};

export default Marker;
