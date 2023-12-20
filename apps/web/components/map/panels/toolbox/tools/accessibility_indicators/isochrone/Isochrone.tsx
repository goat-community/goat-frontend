import React, { useState, useMemo } from "react";
import { Box, Button, useTheme, TextField, Typography } from "@mui/material";
import IsochroneSettings from "@/components/map/panels/toolbox/tools/accessibility_indicators/isochrone/IsochroneSettings";
import StartingPoint from "@/components/map/panels/toolbox/tools/accessibility_indicators/isochrone/StartingPoint";
import { useTranslation } from "@/i18n/client";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  SendPTIsochroneRequest,
  SendCarIsochroneRequest,
  SendIsochroneRequest,
} from "@/lib/api/isochrone";
import { useParams } from "next/navigation";
import { removeMarker } from "@/lib/store/map/slice";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useGetUniqueLayerName } from "@/hooks/map/ToolsHooks";

import type { StartingPointType } from "@/types/map/isochrone";
import type { PostIsochrone } from "@/lib/validations/isochrone";

const Isochrone = () => {
  // Sarting point states
  const [startingType, setStartingType] = useState<
    StartingPointType | undefined
  >(undefined);

  const theme = useTheme();
  const { t } = useTranslation("maps");
  const { projectId } = useParams();
  const dispatch = useDispatch();

  const {
    register,
    reset,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<PostIsochrone>({
    defaultValues: {
      routing_type: "",
      starting_points: {
        latitude: [],
        longitude: [],
      },
      travel_cost: {
        max_traveltime: 10,
        traveltime_step: 50,
        speed: 10,
      },
      layer_name: "isochrone",
    },
  });

  console.log(errors)

  const watchFormValues = watch();

  const handleReset = () => {
    reset();
  };

  const handleRun = () => {
    console.log("body of the request: ", getValues());

    if (typeof watchFormValues.routing_type !== "string") {
      setValue("time_window", {
        weekday: "weekday",
        from_time: 25200,
        to_time: 32400,
      });
      SendPTIsochroneRequest(getValues(), projectId as string);
    } else if (watchFormValues.routing_type === "car_peak") {
      setValue("time_window", {
        weekday: "weekday",
        from_time: 25200,
        to_time: 32400,
      });
      SendCarIsochroneRequest(getValues(), projectId as string);
    } else {
      SendIsochroneRequest(getValues(), projectId as string);
    }
    reset();
    dispatch(removeMarker());
  };

  const getCurrentValues = useMemo(() => {
    return watchFormValues;
  }, [watchFormValues]);

  const { uniqueName } = useGetUniqueLayerName(
    getCurrentValues.layer_name ? getCurrentValues.layer_name : "",
  );

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
        <IsochroneSettings
          register={register}
          getValues={getValues}
          watch={getCurrentValues}
          setValue={setValue}
        />
        {getCurrentValues.routing_type ? (
          <StartingPoint
            register={register}
            setValue={setValue}
            watch={getCurrentValues}
            startingType={startingType}
            setStartingType={setStartingType}
          />
        ) : null}
        {startingType &&
        ("layer_id" in getCurrentValues.starting_points ||
          "latitude" in getCurrentValues.starting_points) ? (
          <Box display="flex" flexDirection="column" gap={theme.spacing(4)}>
            <Typography
              variant="body1"
              fontWeight="bold"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
              }}
            >
              <Icon iconName={ICON_NAME.DOWNLOAD} />
              {t("panels.tools.result")}
            </Typography>
            <Box>
              <TextField
                fullWidth
                value={uniqueName ? uniqueName : ""}
                label={t("panels.tools.output_name")}
                size="small"
                {...register("layer_name")}
              />
            </Box>
          </Box>
        ) : // <SaveResult register={register} watch={getCurrentValues} />
        null}
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: theme.spacing(2),
          alignItems: "center",
        }}
      >
        <Button variant="outlined" sx={{ flexGrow: "1" }} onClick={handleReset}>
          {t("panels.tools.reset")}
        </Button>
        <Button sx={{ flexGrow: "1" }} onClick={handleRun}>
          {t("panels.tools.run")}
        </Button>
      </Box>
    </Box>
  );
};

export default Isochrone;
