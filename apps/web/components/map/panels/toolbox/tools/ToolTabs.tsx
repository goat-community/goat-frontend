import React, { useState } from "react";
import { Box, useTheme, Typography } from "@mui/material";
import { v4 } from "uuid";
import Join from "@/components/map/panels/toolbox/tools/join/Join";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import Aggregate from "@/components/map/panels/toolbox/tools/aggregate/Aggregate";
import { useParams } from "next/navigation";
import { useTranslation } from "@/i18n/client";

interface ToolTabType {
  name: string;
  tooltip: string;
  value: string;
  element: React.ReactNode;
}

const ToolTabs = () => {
  const [value, setValue] = useState<ToolTabType | undefined>(undefined);

  const {t} = useTranslation("maps");

  const theme = useTheme();
  const params = useParams();
  
  const tabs: ToolTabType[] = [
    {
      name: t("panels.tools.join.join"),
      tooltip:
        "Utilize join tool to merge columns from different layers. Apply functions like count, sum, min, etc., for desired results.",
      value: "join",
      element: <Join projectId={typeof params.projectId === "string" ? params.projectId : ""}/>,
    },
    {
      name: t("panels.tools.aggregate.aggregate"),
      tooltip:
        "Utilize join tool to merge columns from different layers. Apply functions like count, sum, min, etc., for desired results.",
      value: "aggregate_features",
      element: <Aggregate projectId={typeof params.projectId === "string" ? params.projectId : ""}/>,
    },
    {
      name: "Summarize features",
      tooltip:
        "Utilize join tool to merge columns from different layers. Apply functions like count, sum, min, etc., for desired results.",
      value: "summarize_features",
      element: <p>summarize</p>,
    },
    {
      name: "Origin to destination",
      tooltip:
        "Utilize join tool to merge columns from different layers. Apply functions like count, sum, min, etc., for desired results.",
      value: "origin_to_destination",
      element: <p>origin</p>,
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

export default ToolTabs;
