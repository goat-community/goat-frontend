import React from "react";
import { Button, Stack } from "@mui/material";
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

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={2}
      sx={{ width: "100%" }}
    >
      <Button
        color="error"
        size="small"
        variant="outlined"
        sx={{ flexGrow: "1" }}
        onClick={resetFunction}
        disabled={resetDisabled}
      >
        {t("panels.tools.reset")}
      </Button>
      <Button
        size="small"
        sx={{ flexGrow: "1" }}
        onClick={runFunction}
        disabled={runDisabled}
      >
        {t("panels.tools.run")}
      </Button>
    </Stack>
  );
};

export default ToolboxActionButtons;
