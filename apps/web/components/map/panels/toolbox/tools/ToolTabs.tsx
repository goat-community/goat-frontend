import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Typography,
  Accordion as MuiAccordion,
  AccordionDetails as MuiAccordionDetails,
  AccordionSummary as MuiAccordionSummary,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { v4 } from "uuid";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useParams } from "next/navigation";
import { useTranslation } from "@/i18n/client";

import Join from "@/components/map/panels/toolbox/tools/join/Join";
import Aggregate from "@/components/map/panels/toolbox/tools/aggregate/Aggregate";
import Isochrone from "@/components/map/panels/toolbox/tools/accessibility_indicators/isochrone/Isochrone";

import type { AccordionProps, AccordionSummaryProps } from "@mui/material";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1.5px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <Icon iconName={ICON_NAME.CHEVRON_RIGHT} sx={{ fontSize: "12px" }} />
    }
    {...props}
  />
))(({ theme }) => ({
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

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
                : `1px solid ${theme.palette.primary.main}80`,
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
            <Icon
              iconName={ICON_NAME.CIRCLEINFO}
              htmlColor={theme.palette.secondary.light}
              sx={{ fontSize: "12px" }}
            />
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

  const params = useParams();

  const main_accordions = [
    {
      name: t("panels.tools.summarize_data.summarize_data"),
      value: "summarize_data",
      children: [
        "join",
        "aggregate",
        "summarize_features",
        "origin_to_destination",
      ],
    },
    {
      name: t("panels.tools.aggregate.aggregate"),
      value: "aggregate_features",
      children: ["accessibility_indicators"],
    },
  ];

  // const allTabs

  const tabs = {
    join: {
      name: t("panels.tools.join.join"),
      value: "join",
      element: (
        <Join
          projectId={
            typeof params.projectId === "string" ? params.projectId : ""
          }
        />
      ),
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
    accessibility_indicators: {
      name: t("panels.tools.accessibility_indicators.accessibility_indicators"),
      value: "accessibility_indicators",
      element: <Isochrone />,
    },
    summarize_features: {
      name: "Summarize features",
      value: "summarize_features",
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
    <Box sx={{ maxHeight: "100%" }}>
      {!value &&
        main_accordions.map((tab) => (
          <Accordion
            key={v4()}
            defaultExpanded={true}
            // expanded={expanded === tab.value}
            // onChange={handleChangetry(tab.value)}
          >
            <AccordionSummary
              expandIcon={<Icon iconName={ICON_NAME.CHEVRON_DOWN} />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ flexShrink: 0 }}>{tab.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Tabs tab={tab} handleChange={handleChange} />
            </AccordionDetails>
          </Accordion>
        ))}
      {value ? <>{tabs[value].element}</> : null}
    </Box>
  );
};

export default ToolTabs;
