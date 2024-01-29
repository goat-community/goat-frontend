import React, { useState, useMemo } from "react";
import { Box } from "@mui/material";
import IsochroneSettings from "@/components/map/panels/toolbox/tools/accessibility_indicators/isochrone/IsochroneSettings";
import StartingPoint from "@/components/map/panels/toolbox/tools/accessibility_indicators/isochrone/StartingPoint";
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
import ToolboxActionButtons from "@/components/map/panels/common/ToolboxActionButtons";

import type { StartingPointType } from "@/types/map/isochrone";
import type { PostIsochrone } from "@/lib/validations/isochrone";

const Isochrone = () => {
  const [startingType, setStartingType] = useState<
    StartingPointType | undefined
  >(undefined);

  // const { t } = useTranslation("maps");
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
      <ToolboxActionButtons
        runFunction={handleRun}
        runDisabled={
          !isValid
        }
        resetFunction={handleReset}
        // resetDisabled={
        //   !getCurrentValues.join_layer_project_id &&
        //       !getCurrentValues.join_field &&
        //       !getCurrentValues.column_statistics.operation &&
        //       !getCurrentValues.column_statistics.field &&
        //       !getCurrentValues.target_layer_project_id &&
        //       !getCurrentValues.target_field
        // }
      />
    </Box>
  );
};

export default Isochrone;
