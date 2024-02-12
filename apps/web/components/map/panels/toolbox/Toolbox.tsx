import React, { useState } from "react";
import {
  Box,
  useTheme,
  Typography,
  List,
  ListItemText,
  ListItemSecondaryAction,
  ListItemButton,
} from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useParams } from "next/navigation";
import { useTranslation } from "@/i18n/client";
import AccordionWrapper from "@/components/common/AccordionWrapper";

import Join from "@/components/map/panels/toolbox/tools/join/Join";
import Aggregate from "@/components/map/panels/toolbox/tools/aggregate/Aggregate";
import AggregatePolygon from "@/components/map/panels/toolbox/tools/aggregatePolygon/AggregatePolygon";
import Buffer from "@/components/map/panels/toolbox/tools/buffer/Buffer";
import OevGuetenklassen from "@/components/map/panels/toolbox/tools/oevGuetenklassen/OevGuetenklassen";
import TripCount from "@/components/map/panels/toolbox/tools/tripCount/TripCount";
import OriginDestination from "@/components/map/panels/toolbox/tools/originDestination/OriginDestination";
import Container from "@/components/map/panels/Container";
import {
  setActiveRightPanel,
  setMaskLayer,
  setToolboxStartingPoints,
} from "@/lib/store/map/slice";
import { useAppDispatch } from "@/hooks/store/ContextHooks";
import CatchmentArea from "@/components/map/panels/toolbox/tools/catchment-area/CatchmentArea";

const Tabs = ({ tab, handleChange }) => {
  const { t } = useTranslation("maps");

  return (
    <List dense sx={{ pt: 0 }}>
      {tab.children.map((childTab) => (
        <ListItemButton key={childTab} onClick={() => handleChange(childTab)}>
          <ListItemText primary={t(`panels.tools.${childTab}.${childTab}`)} />
          <ListItemSecondaryAction>
            <Icon
              iconName={ICON_NAME.CHEVRON_RIGHT}
              sx={{ fontSize: "12px" }}
            />
          </ListItemSecondaryAction>
        </ListItemButton>
      ))}
    </List>
  );
};

const Toolbox = () => {
  const [value, setValue] = useState<string | undefined>(undefined);

  const { t } = useTranslation("maps");
  const theme = useTheme();
  const params = useParams();
  const dispatch = useAppDispatch();

  const handleOnBack = () => {
    setValue(undefined);
    dispatch(setMaskLayer(undefined));
    dispatch(setToolboxStartingPoints(undefined));
  };

  const handleOnClose = () => {
    setValue(undefined);
    dispatch(setActiveRightPanel(undefined));
  };

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
      icon: ICON_NAME.SETTINGS,
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
      element: <CatchmentArea onBack={handleOnBack} onClose={handleOnClose} />,
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
  };

  return (
    <Box sx={{ height: "100%" }}>
      {!value && (
        <Container
          title={t("panels.tools.tools")}
          disablePadding={true}
          close={() => dispatch(setActiveRightPanel(undefined))}
          body={
            <>
              {!value &&
                main_accordions.map((tab) => (
                  <AccordionWrapper
                    key={tab.name}
                    header={
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{
                          flexShrink: 0,
                          display: "flex",
                          gap: theme.spacing(2),
                          alignItems: "center",
                        }}
                      >
                        <Icon
                          iconName={tab.icon}
                          sx={{ fontSize: "16px" }}
                          htmlColor="inherit"
                        />
                        {tab.name}
                      </Typography>
                    }
                    body={<Tabs tab={tab} handleChange={handleChange} />}
                  />
                ))}
            </>
          }
        />
      )}

      {value ? <>{tabs[value].element}</> : null}
    </Box>
  );
};

export default Toolbox;
