import React, { useState } from "react";
import Container from "@/components/map/panels/Container";
import ToolTabs from "@/components/map/panels/toolbox/tools/ToolTabs";
import { useAppDispatch } from "@/hooks/store/ContextHooks";
import { setActiveRightPanel } from "@/lib/store/map/slice";
import { Box, Typography, IconButton } from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useTranslation } from "@/i18n/client";

const ToolboxPanel = () => {
  const [title, setTitle] = useState<string>("Toolbox");
  const [defaultRoute, setDefaultRoute] = useState<"root" | undefined>(
    undefined,
  );

  const dispatch = useAppDispatch();
  const { t } = useTranslation("maps");

  return (
    <Container
      header={
        <>
          <Box display="flex" justifyContent="start" alignItems="center">
            {title !== "Toolbox" ? (
              <IconButton onClick={() => setDefaultRoute("root")}>
                <Icon iconName={ICON_NAME.CHEVRON_LEFT} sx={{fontSize: "15px"}}/>
              </IconButton>
            ) : null}
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{
                display: "flex",
              }}
            >
              {title !== "Toolbox"
                ? t(`panels.tools.${title}.${title}`)
                : title}
            </Typography>
          </Box>
        </>
      }
      close={() => dispatch(setActiveRightPanel(undefined))}
      body={
        <ToolTabs
          setTitle={setTitle}
          defaultRoute={defaultRoute}
          setDefaultRoute={setDefaultRoute}
        />
      }
      disablePadding
    />
  );
};

export default ToolboxPanel;
