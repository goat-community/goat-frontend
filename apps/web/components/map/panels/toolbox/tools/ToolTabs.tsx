import React, { useState, useEffect } from "react";
import { Box, useTheme, Typography, Tooltip } from "@mui/material";
import { v4 } from "uuid";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useParams } from "next/navigation";
import { useTranslation } from "@/i18n/client";
import AccordionWrapper from "@/components/common/AccordionWrapper";

import Join from "@/components/map/panels/toolbox/tools/join/Join";
import Aggregate from "@/components/map/panels/toolbox/tools/aggregate/Aggregate";
import Isochrone from "@/components/map/panels/toolbox/tools/accessibility_indicators/isochrone/Isochrone";

const Tabs = ({ tab, handleChange }) => {
  const { t } = useTranslation("maps");
  const theme = useTheme();

  return (
    <>
      {tab.children.map((childTab, index) => (
        <Box
          key={v4()}
          sx={{
            padding: "12px 0",
            borderBottom:
              index + 1 === tab.children.length
                ? "none"
                : `1px solid ${theme.palette.secondary.main}80`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              bWackgroundColor: `${theme.palette.secondary.light}40`,
            },
          }}
          onClick={() => handleChange(childTab)}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing(2),
            }}
          >
            <Tooltip
              title={t(`panels.tools.${childTab}.tooltip`)}
              placement="left"
            >
              <Box>
                <Icon
                  iconName={ICON_NAME.CIRCLEINFO}
                  htmlColor={theme.palette.secondary.light}
                  sx={{ fontSize: "12px" }}
                />
              </Box>
            </Tooltip>
            <Typography variant="body1">
              {t(`panels.tools.${childTab}.${childTab}`)}
            </Typography>
          </Box>
          <Icon iconName={ICON_NAME.CHEVRON_RIGHT} sx={{ fontSize: "12px" }} />
        </Box>
      ))}
    </>
  );
};

interface ToolTabsProps {
  setTitle: (value: string) => void;
  defaultRoute: "root" | undefined;
  setDefaultRoute: (value: "root" | undefined) => void;
}

const ToolTabs = (props: ToolTabsProps) => {
  const { setTitle, defaultRoute, setDefaultRoute } = props;

  const [value, setValue] = useState<string | undefined>(undefined);

  const { t } = useTranslation("maps");
  const theme = useTheme();
  const params = useParams();

  const main_accordions = [
    {
      name: "Accessibility Indicators",
      value: "accessibility_indicators",
      children: ["catchment_area"],
      icon: ICON_NAME.RUN,
    },
    {
      name: "Data Management",
      value: "data_management",
      children: ["join"],
      icon: ICON_NAME.DATABASE,
    },
    {
      name: "Geoanalysis",
      value: "geoanalysis",
      children: ["aggregate"],
      icon: ICON_NAME.CHART,
    },
    {
      name: "Geoprocessing",
      value: "geoprocessing",
      children: ["buffer"],
      icon: ICON_NAME.LAYERS,
    },
  ];

  const tabs = {
    join: {
      name: t("panels.tools.join.join"),
      value: "join",
      element: <Join />,
    },
    aggregate: {
      name: t("panels.tools.aggregate.aggregate"),
      value: "aggregate",
      element: (
        <Aggregate
          projectId={
            typeof params.projectId === "string" ? params.projectId : ""
          }
        />
      ),
    },
    catchment_area: {
      name: t("panels.tools.catchment_area.catchment_area"),
      value: "catchment_area",
      element: <Isochrone />,
    },
    buffer: {
      name: "Buffer features",
      value: "buffer",
      element: <p>summarize</p>,
    },
    origin_to_destination: {
      name: "Origin to destination",
      value: "origin_to_destination",
      element: <p>origin</p>,
    },
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
    setTitle(newValue as string);
    setDefaultRoute(undefined);
  };

  useEffect(() => {
    if (defaultRoute === "root") {
      setValue(undefined);
      setTitle("Toolbox");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultRoute]);

  return (
    <Box sx={{ height: "100%" }}>
      {!value &&
        main_accordions.map((tab) => (
          <AccordionWrapper
            key={v4()}
            header={
              <Typography sx={{ flexShrink: 0, display: "flex", gap: theme.spacing(2), alignItems: "center" }}>
                <Icon iconName={tab.icon} sx={{fontSize: "18px"}} htmlColor={theme.palette.secondary.dark}/>
                {tab.name}
              </Typography>
            }
            body={<Tabs tab={tab} handleChange={handleChange} />}
          />
        ))}
      {value ? <>{tabs[value].element}</> : null}
    </Box>
  );
};

export default ToolTabs;
