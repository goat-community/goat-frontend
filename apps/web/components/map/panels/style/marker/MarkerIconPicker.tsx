import { ArrowPopper } from "@/components/ArrowPoper";
import FormLabelHelper from "@/components/common/FormLabelHelper";
import MarkerGallery from "@/components/map/panels/style/marker/MarkerGallery";
import { MaskedImageIcon } from "@/components/map/panels/style/other/MaskedImageIcon";
import {
  MAKI_ICON_SIZE,
  MAKI_ICONS_BASE_URL,
  NO_ICON_ICON,
} from "@/lib/constants/icons";
import ClearIcon from "@mui/icons-material/Clear";
import { IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";

type SelectedMarker = {
  name: string;
  url: string;
};

type MarkerIconPickerProps = {
  label?: string;
  tooltip?: string;
  selectedMarker?: SelectedMarker;
  onSelectMarker: (marker: SelectedMarker) => void;
};

const MarkerIconPicker = (props: MarkerIconPickerProps) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const imgColor = useMemo(() => {
    if (open) {
      return theme.palette.primary.main;
    } else if (!!props.selectedMarker?.url) {
      return "";
    } else {
      return theme.palette.mode === "dark" ? "#5B5F6E" : "#B8B7BF";
    }
  }, [
    open,
    props.selectedMarker?.url,
    theme.palette.mode,
    theme.palette.primary.main,
  ]);

  return (
    <>
      <ArrowPopper
        open={open}
        placement="bottom"
        arrow={false}
        isClickAwayEnabled={true}
        onClose={() => setOpen(false)}
        content={
          <>
            <MarkerGallery
              onSelectMarker={(marker) => {
                props.onSelectMarker(marker);
                setOpen(false);
              }}
            />
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
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
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
              py: 0.5,
              minHeight: "40px",
              "&:hover": {
                ...(!open && {
                  borderColor:
                    theme.palette.mode === "dark" ? "#5B5F6E" : "#B8B7BF",
                }),
              },
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{ p: 0, m: 0 }}
              alignItems="center"
            >
              <MaskedImageIcon
                imageUrl={
                  props.selectedMarker?.url ||
                  `${MAKI_ICONS_BASE_URL}/${NO_ICON_ICON}.svg`
                }
                dimension={`${MAKI_ICON_SIZE}px`}
                imgColor={imgColor}
              />

              <Typography
                variant="body2"
                fontWeight={props.selectedMarker?.url ? "bold" : "normal"}
              >
                {props.selectedMarker?.name}
              </Typography>
            </Stack>
            {props.selectedMarker?.url && (
              <IconButton
                size="small"
                sx={{ visibility: props.selectedMarker ? "visible" : "hidden" }}
                onClick={(e) => {
                  e.stopPropagation();
                  props.onSelectMarker({ name: "", url: "" });
                }}
              >
                <ClearIcon />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </ArrowPopper>
    </>
  );
};

export default MarkerIconPicker;
