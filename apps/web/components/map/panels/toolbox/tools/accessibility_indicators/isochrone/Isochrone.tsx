import React, { useState, useMemo } from "react";
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

import IsochroneSettings from "@/components/map/panels/toolbox/tools/accessibility_indicators/isochrone/IsochroneSettings";
import StartingPoint from "@/components/map/panels/toolbox/tools/accessibility_indicators/isochrone/StartingPoint";
import AdvancedSettings from "@/components/map/panels/toolbox/tools/accessibility_indicators/isochrone/AdvancedSettings";

import type { StartingPointType } from "@/types/map/isochrone";
import type { PostIsochrone } from "@/lib/validations/isochrone";
import Container from "@/components/map/panels/Container";
import ToolsHeader from "@/components/map/panels/toolbox/common/ToolsHeader";

interface IndicatorBaseProps {
  onBack: () => void;
  onClose: () => void;
}

const Isochrone = ({ onBack, onClose }: IndicatorBaseProps) => {
  const [startingType, setStartingType] = useState<
    StartingPointType | undefined
  >(undefined);

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
        max_traveltime: 45,
        traveltime_step: 5,
        speed: 10,
      },
      isochrone_type: "polygon",
      polygon_difference: true,
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
    reset();
  };

  const getCurrentValues = useMemo(() => {
    return watchFormValues;
  }, [watchFormValues]);

  return (
    <Container
      disablePadding={false}
      header={<ToolsHeader onBack={onBack} title="Isochrone" />}
      close={onClose}
      body={
        <>
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
          <AdvancedSettings
            setValue={setValue}
            watch={getCurrentValues}
            errors={errors}
          />
        </>
      }
      action={
        <ToolboxActionButtons
          runFunction={handleRun}
          runDisabled={!isValid}
          resetFunction={handleReset}
        />
      }
    />
  );
};

export default Isochrone;
