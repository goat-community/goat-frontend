import React, { useState } from "react";
import InputLayer from "@/components/map/panels/toolbox/tools/join/InputLayer";
import FieldsToMatch from "@/components/map/panels/toolbox/tools/join/FieldsToMatch";
import Statistics from "@/components/map/panels/toolbox/tools/join/Statistics";
import { Divider, useTheme, Box, Button } from "@mui/material";

type ColumStatisticsOperation =
  | "count"
  | "sum"
  | "mean"
  | "median"
  | "min"
  | "max";

const Join = () => {
  const [inputValues, setInputValues] = useState<string | string[]>(["", ""]);
  const [firstField, setFirstField] = useState<string | undefined>(undefined);
  const [secondField, setSecondField] = useState<string | undefined>(undefined);
  const [method, setMethod] = useState<ColumStatisticsOperation | undefined>(
    undefined,
  );
  const [statisticField, setStatisticField] = useState<string | undefined>(
    undefined,
  );
  const [label, setLabel] = useState<string | undefined>(undefined);

  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between" sx={{maxHeight: "100%", flexGrow: "1"}}>
      <Box sx={{overflow: "scroll", maxHeight: `90%`}}>
        <InputLayer
          multiple
          inputValues={inputValues}
          setInputValues={setInputValues}
        />
        <Divider
          sx={{
            margin: `${theme.spacing(4)} 0px`,
            backgroundColor: `${theme.palette.primary.main}40`,
          }}
        />
        <FieldsToMatch
          firstLayerId={inputValues[0]}
          secondLayerId={inputValues[1]}
          setSecondField={setSecondField}
          setFirstField={setFirstField}
          firstField={firstField}
          secondField={secondField}
        />
        <Statistics
          secondLayerId={inputValues[1]}
          secondField={secondField}
          setMethod={setMethod}
          method={method}
          setStatisticField={setStatisticField}
          statisticField={statisticField}
          setLabel={setLabel}
          label={label}
        />
      </Box>
      <Box sx={{height: theme.spacing(4)}}>
        <Button>Reset</Button>
      </Box>
    </Box>
  );
};

export default Join;
