import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "@/i18n/client";
import { LoadingButton } from "@mui/lab";

interface ToolboxActionButtonsProps {
  resetFunction: () => void;
  resetDisabled?: boolean;
  runFunction: () => void;
  runDisabled?: boolean;
  isBusy?: boolean;
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
      <LoadingButton
        size="small"
        variant="contained"
        loading={props.isBusy}
        sx={{ flexGrow: "1" }}
        onClick={runFunction}
        disabled={runDisabled}
      >
        <Typography variant="body2" fontWeight="bold" color="inherit">
          {t("panels.tools.run")}
        </Typography>
      </LoadingButton>
    </Stack>
  );
};

export default ToolboxActionButtons;
