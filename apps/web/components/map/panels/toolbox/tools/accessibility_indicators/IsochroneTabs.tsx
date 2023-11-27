import React, { useState } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { v4 } from "uuid";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
// import { useParams } from "next/navigation";
import { useTranslation } from "@/i18n/client";

import Isochrone from "@/components/map/panels/toolbox/tools/accessibility_indicators/isochrone/Isochrone";

interface ToolTabType {
  name: string;
  tooltip: string;
  value: string;
  element: React.ReactNode;
}

const IsochroneTabs = () => {
  const [value, setValue] = useState<ToolTabType | undefined>(undefined);

  const {t} = useTranslation("maps");

  const theme = useTheme();
  // const params = useParams();
  
  const tabs: ToolTabType[] = [
    {
      name: t("panels.tools.accessibility_indicators.isochrone"),
      tooltip:
        "Utilize join tool to merge columns from different layers. Apply functions like count, sum, min, etc., for desired results.",
      value: "aggregate_features",
      element: <Isochrone />,
    },
  ];
  
  const handleChange = (newValue: ToolTabType | undefined) => {
    setValue(newValue);
  };

  return (
    <Box sx={{maxHeight: "100%"}}>
      {!value &&
        tabs.map((tab) => (
          <Box
            key={v4()}
            sx={{
              padding: "12px 0",
              borderBottom: `1px solid ${theme.palette.primary.main}80`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: `${theme.palette.secondary.light}40`
              }
            }}
            onClick={() => handleChange(tab)}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: theme.spacing(2) }}>
              <Icon iconName={ICON_NAME.CIRCLEINFO} htmlColor={theme.palette.secondary.light} sx={{ fontSize: "12px" }} />
              <Typography variant="body1">{tab.name}</Typography>
            </Box>
            <Icon
              iconName={ICON_NAME.CHEVRON_RIGHT}
              sx={{ fontSize: "12px" }}
            />
          </Box>
        ))}
      {value ? (
        <>
          {/* <Box onClick={() => handleChange(undefined)}>Back</Box> */}
          {value.element}
        </>
      ) : null}
    </Box>
  );
};

export default IsochroneTabs;
