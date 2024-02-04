import React from "react";
import { Box, Button, useTheme } from "@mui/material";
import { useTranslation } from "@/i18n/client";

interface ToolboxActionButtonsProps {
  resetFunction: () => void;
  resetDisabled?: boolean;
  runFunction: () => void;
  runDisabled?: boolean;
}

const ToolboxActionButtons = (props: ToolboxActionButtonsProps) => {
  const { resetFunction, resetDisabled, runFunction, runDisabled } = props;
  const { t } = useTranslation("maps");

  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "relative",
        maxHeight: "5%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: theme.spacing(2),
          alignItems: "center",
          position: "absolute",
          bottom: "-28px",
          left: "-8px",
          width: "calc(100% + 16px)",
          padding: "16px",
          background: theme.palette.background.paper,
          boxShadow: "0px -5px 10px -5px rgba(58, 53, 65, 0.1)",
        }}
      >
        <Button
          color="error"
          variant="outlined"
          sx={{ flexGrow: "1" }}
          onClick={resetFunction}
          disabled={resetDisabled ? resetDisabled : false}
        >
          {t("panels.tools.reset")}
        </Button>
        <Button
          sx={{ flexGrow: "1" }}
          onClick={runFunction}
          disabled={runDisabled ? runDisabled : false}
        >
          {t("panels.tools.run")}
        </Button>
      </Box>
    </Box>
  );
};

export default ToolboxActionButtons;
