import { ArrowPopper } from "@/components/ArrowPoper";
import FormLabelHelper from "@/components/common/FormLabelHelper";
import NumericColorScale from "@/components/map/panels/style/classification/NumericColorScale";
import OrdinalColorScale from "@/components/map/panels/style/classification/OrdinalColorScale";
import { useTranslation } from "@/i18n/client";
import type { ColorScaleSelectorProps } from "@/types/map/color";
import { Paper, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

const ColorScaleSelector = (props: ColorScaleSelectorProps) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("maps");
  const [isClickAwayEnabled, setIsClickAwayEnabled] = useState(true);

  return (
    <>
      <ArrowPopper
        open={open}
        placement="bottom"
        arrow={false}
        isClickAwayEnabled={isClickAwayEnabled}
        onClose={() => setOpen(false)}
        content={
          <>
            <Paper
              sx={{
                boxShadow: "rgba(0, 0, 0, 0.16) 0px 6px 12px 0px",
                width: "235px",
                maxHeight: "500px",
              }}
            >
              {props.activeLayerField.type === "number" &&
                props.selectedColorScaleMethod !== "ordinal" && (
                  <NumericColorScale
                    {...props}
                    onCancel={() => setOpen(false)}
                    setIsClickAwayEnabled={setIsClickAwayEnabled}
                  />
                )}
              {props.selectedColorScaleMethod === "ordinal" && (
                <OrdinalColorScale
                  {...props}
                  onCancel={() => setOpen(false)}
                  setIsClickAwayEnabled={setIsClickAwayEnabled}
                />
              )}
            </Paper>
          </>
        }
      >
        {/* {INPUT} */}
        <Stack spacing={1}>
          {props.label && (
            <FormLabelHelper
              color={open ? theme.palette.primary.main : "inherit"}
              label={props.label}
              tooltip={props.tooltip}
            />
          )}
          <Stack
            onClick={() => setOpen(!open)}
            direction="row"
            sx={{
              borderRadius: theme.spacing(1.2),
              border: "1px solid",
              outline: "2px solid transparent",
              borderColor:
                theme.palette.mode === "dark" ? "#464B59" : "#CBCBD1",
              ...(open && {
                outline: `2px solid ${theme.palette.primary.main}`,
              }),
              cursor: "pointer",
              p: 1.7,
              "&:hover": {
                ...(!open && {
                  borderColor:
                    theme.palette.mode === "dark" ? "#5B5F6E" : "#B8B7BF",
                }),
              },
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              {t(`${props.selectedColorScaleMethod}`)}
            </Typography>
          </Stack>
        </Stack>
      </ArrowPopper>
    </>
  );
};

export default ColorScaleSelector;
