import React, { useMemo } from "react";
import { Box, Button, useTheme } from "@mui/material";
import { useTranslation } from "@/i18n/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accessibilityIndicatorBaseSchema } from "@/lib/validations/tools";
import { sendOevGuetenKlassenRequest } from "@/lib/api/tools";
import { useParams } from "next/navigation";

import ReferenceAreLayer from "@/components/map/panels/toolbox/tools/oevGuetenklassen/ReferenceAreLayer";
import IndicatorTimeSettings from "@/components/map/panels/toolbox/tools/oevGuetenklassen/IndicatorTimeSettings";

import type { PostOevGuetenKlassen } from "@/lib/validations/tools";

const OevGuetenklassen = () => {
  const theme = useTheme();
  const { t } = useTranslation("maps");

  const { projectId } = useParams();

  const {
    register,
    // reset,
    watch,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm<PostOevGuetenKlassen>({
    mode: "onChange",
    resolver: zodResolver(accessibilityIndicatorBaseSchema),
    defaultValues: {
      time_window: {
        weekday: "weekday",
        from_time: 2000,
        to_time: 5000,
      },
      reference_area_layer_project_id: 0,
      station_config: {
        groups: {
          "0": "B",
          "1": "A",
          "2": "A",
          "3": "C",
          "7": "B",
          "100": "A",
          "101": "A",
          "102": "A",
          "103": "A",
          "104": "A",
          "105": "A",
          "106": "A",
          "107": "A",
          "108": "A",
          "109": "A",
          "110": "A",
          "111": "A",
          "112": "A",
          "114": "A",
          "116": "A",
          "117": "A",
          "200": "C",
          "201": "C",
          "202": "C",
          "204": "C",
          "400": "A",
          "401": "A",
          "402": "A",
          "403": "A",
          "405": "A",
          "700": "C",
          "701": "C",
          "702": "C",
          "704": "C",
          "705": "C",
          "712": "C",
          "715": "C",
          "800": "C",
          "900": "B",
          "901": "B",
          "902": "B",
          "903": "B",
          "904": "B",
          "905": "B",
          "906": "B",
          "1400": "B",
        },
        time_frequency: [0, 4, 10, 19, 39, 60, 119],
        categories: [
          {
            A: 1,
            B: 1,
            C: 2,
          },
          {
            A: 1,
            B: 2,
            C: 3,
          },
          {
            A: 2,
            B: 3,
            C: 4,
          },
          {
            A: 3,
            B: 4,
            C: 5,
          },
          {
            A: 4,
            B: 5,
            C: 6,
          },
          {
            A: 5,
            B: 6,
            C: 7,
          },
        ],
        classification: {
          "1": {
            "300": "1",
            "500": "1",
            "750": "2",
            "1000": "3",
            "1250": "4",
          },
          "2": {
            "300": "1",
            "500": "2",
            "750": "3",
            "1000": "4",
            "1250": "5",
          },
          "3": {
            "300": "2",
            "500": "3",
            "750": "4",
            "1000": "5",
            "1250": "6",
          },
          "4": {
            "300": "3",
            "500": "4",
            "750": "5",
            "1000": "6",
            "1250": "6",
          },
          "5": {
            "300": "4",
            "500": "5",
            "750": "6",
          },
          "6": {
            "300": "5",
            "500": "6",
          },
          "7": {
            "300": "6",
          },
        },
      },
    },
  });

  const watchFormValues = watch();

  const getCurrentValues = useMemo(() => {
    return watchFormValues;
  }, [watchFormValues]);

  console.log(errors, isValid, getCurrentValues);

  function handleReset() {}

  function handleRun() {
    sendOevGuetenKlassenRequest(getValues(), projectId as string);
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{ height: "100%" }}
    >
      <Box
        sx={{
          height: "95%",
          maxHeight: "95%",
          overflow: "scroll",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <IndicatorTimeSettings
          setValue={setValue}
          watch={getCurrentValues}
          errors={errors}
        />

        <ReferenceAreLayer
          register={register}
          watch={getCurrentValues}
          errors={errors}
        />
      </Box>
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
            bottom: "-25px",
            left: "-8px",
            width: "calc(100% + 16px)",
            padding: "16px",
            background: "white",
            boxShadow: "0px -5px 10px -5px rgba(58, 53, 65, 0.1)",
          }}
        >
          <Button
            color="error"
            variant="outlined"
            sx={{ flexGrow: "1" }}
            onClick={handleReset}
            disabled={
              !getCurrentValues.time_window.weekday &&
              !getCurrentValues.time_window.from_time &&
              !getCurrentValues.time_window.to_time &&
              !getCurrentValues.reference_area_layer_project_id
            }
          >
            {t("panels.tools.reset")}
          </Button>
          <Button
            sx={{ flexGrow: "1" }}
            onClick={handleRun}
            disabled={!isValid}
          >
            {t("panels.tools.run")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default OevGuetenklassen;
