import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
} from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

import type { ReactNode } from "react";

const AccordionWrapper = ({
  header,
  body,
}: {
  header: ReactNode;
  body: ReactNode;
}) => {
  return (
    <Accordion square={false}>
      <AccordionSummary
        sx={{
          my: 0,
          py: 0,
        }}
        expandIcon={
          <Icon
            iconName={ICON_NAME.CHEVRON_DOWN}
            style={{ fontSize: "15px" }}
          />
        }
        aria-controls="panel1a-content"
      >
        {header}
      </AccordionSummary>
      <Divider sx={{ mt: 0, pt: 0 }} />
      <AccordionDetails sx={{ mt: 0, p: 0 }}>{body}</AccordionDetails>
    </Accordion>
  );
};

export default AccordionWrapper;
