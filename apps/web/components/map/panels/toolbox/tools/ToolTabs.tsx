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
import AggregatePolygon from "@/components/map/panels/toolbox/tools/aggregatePolygon/AggregatePolygon";
import Buffer from "@/components/map/panels/toolbox/tools/buffer/Buffer";
import OevGuetenklassen from "@/components/map/panels/toolbox/tools/oevGuetenklassen/OevGuetenklassen";
import TripCount from "@/components/map/panels/toolbox/tools/tripCount/TripCount";
import OriginDestination from "@/components/map/panels/toolbox/tools/originDestination/OriginDestination";

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
      children: ["catchment_area", "oev_gutenklassen", "trip_count"],
      icon: ICON_NAME.BULLSEYE,
    },
    {
      name: "Data Management",
      value: "data_management",
      children: ["join"],
      icon: ICON_NAME.TABLE,
    },
    {
      name: "Geoanalysis",
      value: "geoanalysis",
      children: ["aggregate", "aggregate_polygon", "origin_destination"],
      icon: ICON_NAME.CHART,
    },
    {
      name: "Geoprocessing",
      value: "geoprocessing",
      children: ["buffer"],
      icon: ICON_NAME.DRAW_POLYGON,
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
    aggregate_polygon: {
      name: t("panels.tools.aggregate_polygon.aggregate_polygon"),
      value: "aggregate_polygon",
      element: (
        <AggregatePolygon
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
      name: t("panels.tools.buffer.buffer"),
      value: "buffer",
      element: <Buffer />,
    },
    origin_to_destination: {
      name: t("panels.tools.origin_to_destination.origin_to_destination"),
      value: "origin_to_destination",
      element: <p>origin</p>,
    },
    oev_gutenklassen: {
      name: t("panels.tools.oev_gutenklassen.oev_gutenklassen"),
      value: "oev_gutenklassen",
      element: <OevGuetenklassen />,
    },
    trip_count: {
      name: t("panels.tools.trip_count.trip_count"),
      value: "trip_count",
      element: <TripCount />,
    },
    origin_destination: {
      name: t("panels.tools.origin_destination.origin_destination"),
      value: "origin_destination",
      element: <OriginDestination />,
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
              <Typography
                sx={{
                  flexShrink: 0,
                  display: "flex",
                  gap: theme.spacing(2),
                  alignItems: "center",
                }}
              >
                <Icon
                  iconName={tab.icon}
                  sx={{ fontSize: "18px" }}
                  htmlColor={theme.palette.secondary.dark}
                />
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
