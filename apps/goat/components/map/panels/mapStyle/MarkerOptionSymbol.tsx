import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import BasicAccordion from "@p4b/ui/components/BasicAccordion";

import React, { useState } from "react";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { makeStyles } from "@/lib/theme";
import { useTheme } from "@p4b/ui/components/theme";
import { useSelector } from "react-redux";
import type { IStore } from "@/types/store";
import star from "@/public/assets/poi-icons/star.svg";
import circle from "@/public/assets/poi-icons/circle.svg";

const MarkerOptionSymbol = () => {
  const { changeIcon } = useSelector((state: IStore) => state.styling);
  const { classes } = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState("icon");

  return (
    <BasicAccordion title="Marker" variant="secondary">
      <FormControl sx={{ m: 1, width: "100%" }}>
        <Select
          value={value}
          size="small"
          onChange={(e) => {
            setValue(e.target.value);
          }}
          className={classes.select}
        >
          <MenuItem value="icon" className={classes.menuItem}>
            <Icon
              iconName={ICON_NAME.STAR}
              htmlColor={theme.colors.palette.focus.main}
              fontSize="small"
            />
            <Typography variant="body2">Icon</Typography>
          </MenuItem>
          <MenuItem value="shape" className={classes.menuItem}>
            <Icon
              iconName={ICON_NAME.CIRCLE}
              htmlColor={theme.colors.palette.focus.main}
              fontSize="small"
            />
            <Typography variant="body2">Shape</Typography>
          </MenuItem>
        </Select>
      </FormControl>
      {value === "icon" && (
        <div
          style={{
            paddingBlock: "10px",
            border: "1px solid rgb(190, 190, 190)",
            borderRadius: "4px",
            marginLeft: "4px",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <Icon
            iconName={ICON_NAME.STAR}
            style={{
              cursor: "pointer",
            }}
            onClick={() => changeIcon?.(star.src)}
          />
          <Icon
            iconName={ICON_NAME.CIRCLE}
            style={{
              cursor: "pointer",
            }}
            onClick={() => changeIcon?.(circle.src)}
          />
        </div>
      )}
    </BasicAccordion>
  );
};

const useStyles = makeStyles({ name: { MarkerOptionSymbol } })(() => ({
  select: {
    "& .MuiSelect-select": {
      display: "flex",
      columnGap: "8px",
      alignItems: "center",
    },
  },
  menuItem: {
    display: "flex",
    columnGap: "8px",
    alignItems: "center",
  },
}));

export default MarkerOptionSymbol;
