import React, { useState, useMemo } from "react";
import { Box, Button, useTheme } from "@mui/material";
import IsochroneSettings from "@/components/map/panels/toolbox/tools/accessibility_indicators/isochrone/IsochroneSettings";
import StartingPoint from "@/components/map/panels/toolbox/tools/accessibility_indicators/isochrone/StartingPoint";
import { useTranslation } from "@/i18n/client";
import { useForm } from "react-hook-form";
import {
  SendPTIsochroneRequest,
  SendCarIsochroneRequest,
  SendIsochroneRequest,
} from "@/lib/api/isochrone";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { IsochroneBaseSchema } from "@/lib/validations/isochrone";
import { useDispatch } from "react-redux";
import { removeMarker } from "@/lib/store/map/slice";

import type { StartingPointType } from "@/types/map/isochrone";
import type { PostIsochrone } from "@/lib/validations/isochrone";

const Isochrone = () => {
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
    formState: { isValid, errors },
  } = useForm<PostIsochrone>({
    mode: "onChange",
    resolver: zodResolver(IsochroneBaseSchema),
    defaultValues: {
      routing_type: "",
      starting_points: {
        latitude: [],
        longitude: [],
      },
      travel_cost: {
        max_traveltime: 0,
        traveltime_step: 0,
        speed: 0,
      },
      time_window: {
        weekday: "monday",
        from_time: 25200,
        to_time: 32400,
      },
    },
  });

  const watchFormValues = watch();

  const handleReset = () => {
    reset();
    dispatch(removeMarker());
  };

  const handleRun = () => {
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
  };

  const getCurrentValues = useMemo(() => {
    return watchFormValues;
  }, [watchFormValues]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{ height: "100%" }}
    >
      <Box
        sx={{
          // px: 3,
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
          errors={errors}
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

export default Isochrone;
