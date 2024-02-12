import React from "react";
import { Stack } from "@mui/material";

import type { CatchmentAreaRoutingType } from "@/lib/validations/tools";
import { CatchmentAreaRoutingTypeEnum } from "@/lib/validations/tools";
import Selector from "@/components/map/panels/common/Selector";
import FormLabelHelper from "@/components/common/FormLabelHelper";
import TimePicker from "@p4b/ui/components/TimePicker";
import type { SelectorItem } from "@/types/map/common";
import { getTravelCostConfigValues } from "@/components/map/panels/toolbox/tools/catchment-area/utils";

type CatchmentAreaTimeSelectorsProps = {
  routingType: CatchmentAreaRoutingType;
  maxTravelTime: SelectorItem | undefined;
  setMaxTravelTime: (item: SelectorItem) => void;
  speed: SelectorItem | undefined;
  setSpeed: (item: SelectorItem) => void;
  steps: SelectorItem | undefined;
  setSteps: (item: SelectorItem) => void;
  areStepsValid: boolean;
  ptStartTime: number | undefined;
  setPTStartTime: (value: number) => void;
  ptEndTime: number | undefined;
  setPTEndTime: (value: number) => void;
  ptDays: SelectorItem[];
  ptDay: SelectorItem | undefined;
  setPTDay: (item: SelectorItem) => void;
  isPTValid: boolean;
  t: (key: string) => string;
};

const CatchmentAreaTimeSelectors: React.FC<CatchmentAreaTimeSelectorsProps> = ({
  routingType,
  maxTravelTime,
  setMaxTravelTime,
  speed,
  setSpeed,
  steps,
  setSteps,
  areStepsValid,
  ptStartTime,
  setPTStartTime,
  ptEndTime,
  setPTEndTime,
  ptDays,
  ptDay,
  setPTDay,
  isPTValid,
  t,
}) => {
  return (
    <Stack spacing={2}>
      <Selector
        selectedItems={maxTravelTime}
        setSelectedItems={(item: SelectorItem[] | SelectorItem | undefined) => {
          setMaxTravelTime(item as SelectorItem);
        }}
        items={getTravelCostConfigValues(3, 45, "min")}
        label={t("travel_time_limit") + " (Min)"}
        tooltip={t("travel_time_limit_tooltip")}
      />

      {routingType && routingType !== CatchmentAreaRoutingTypeEnum.Enum.pt && (
        <Selector
          selectedItems={speed}
          setSelectedItems={(
            item: SelectorItem[] | SelectorItem | undefined,
          ) => {
            setSpeed(item as SelectorItem);
          }}
          items={getTravelCostConfigValues(1, 25, "Km/h")}
          label={t("travel_time_speed") + " (Km/h)"}
          tooltip={t("travel_time_speed_tooltip")}
        />
      )}

      <Selector
        selectedItems={steps}
        setSelectedItems={(item: SelectorItem[] | SelectorItem | undefined) => {
          setSteps(item as SelectorItem);
        }}
        errorMessage={!areStepsValid ? t("travel_time_step_error") : ""}
        items={getTravelCostConfigValues(3, 9)}
        label={t("travel_time_step") + " (Steps)"}
        tooltip={t("travel_time_step_tooltip")}
      />
      {routingType === CatchmentAreaRoutingTypeEnum.Enum.pt && (
        <Stack spacing={2}>
          <Selector
            selectedItems={ptDay}
            setSelectedItems={(
              item: SelectorItem[] | SelectorItem | undefined,
            ) => {
              setPTDay(item as SelectorItem);
            }}
            items={ptDays}
            label={t("pt_day")}
            tooltip={t("pt_day_tooltip")}
          />
          <Stack>
            <FormLabelHelper
              label={t("pt_start_time")}
              color="inherit"
              tooltip={t("pt_start_time_tooltip")}
            />
            <TimePicker
              time={ptStartTime || 25200}
              onChange={(time) => {
                setPTStartTime(time);
              }}
              error={!isPTValid}
            />
          </Stack>
          <Stack>
            <FormLabelHelper
              label={t("pt_end_time")}
              color="inherit"
              tooltip={t("pt_end_time_tooltip")}
            />
            <TimePicker
              time={ptEndTime || 32400}
              onChange={(time) => {
                setPTEndTime(time);
              }}
              errorMessage={!isPTValid ? t("pt_end_time_error") : ""}
            />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default CatchmentAreaTimeSelectors;
