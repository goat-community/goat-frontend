import React, { useState } from "react";
import InputLayer from "@/components/map/panels/toolbox/tools/InputLayer";
import FieldsToMatch from "@/components/map/panels/toolbox/tools/join/FieldsToMatch";
import Statistics from "@/components/map/panels/toolbox/tools/join/Statistics";
import { Divider, useTheme, Box, Button } from "@mui/material";
import { SendJoinFeatureRequest } from "@/lib/api/tools";
import { useTranslation } from "@/i18n/client";
import SaveResult from "@/components/map/panels/toolbox/tools/SaveResult";

import type { PostJoin } from "@/lib/validations/tools";

type ColumStatisticsOperation =
  | "count"
  | "sum"
  | "mean"
  | "median"
  | "min"
  | "max";

interface JoinProps {
  projectId: string;
}

const Join = (props: JoinProps) => {
  const { projectId } = props;

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
  const [outputName, setOutputName] = useState<string | undefined>(undefined);
  const [folderSaveID, setFolderSaveID] = useState<string | undefined>(
    undefined,
  );

  const theme = useTheme();
  const { t } = useTranslation("maps");

  const handleReset = () => {
    setInputValues(["", ""]);
    setFirstField(undefined);
    setSecondField(undefined);
    setMethod(undefined);
    setStatisticField(undefined);
    setLabel(undefined);
  };

  const handleRun = () => {
    if (
      inputValues[0].length &&
      inputValues[1].length &&
      firstField &&
      secondField &&
      method &&
      statisticField &&
      label
    ) {
      const requestBody: PostJoin = {
        target_layer_id: inputValues[0],
        target_field: firstField,
        join_layer_id: inputValues[1],
        join_field: secondField,
        column_statistics: {
          operation: method,
          field: statisticField,
        },
        result_target: {
          layer_name: outputName ? outputName : `${statisticField}_${method}`,
          folder_id: "159cc0f9-81e9-497d-8823-d9d37507ed54",
          project_id: projectId
        },
      };

      console.log(requestBody);
      SendJoinFeatureRequest(requestBody);
    } else {
      console.log("Error: Not all fields are filled");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{ height: "100%" }}
    >
      <Box sx={{ maxHeight: "95%", overflow: "scroll" }}>
        <InputLayer
          layerTypes={[]}
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
          setOutputName={setOutputName}
          statisticField={statisticField}
          setLabel={setLabel}
          label={label}
        />
        {secondField && method ? (
          <SaveResult
            outputName={outputName}
            setOutputName={setOutputName}
            folderSaveId={folderSaveID}
            setFolderSaveID={setFolderSaveID}
          />
        ) : null}
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

export default Join;
