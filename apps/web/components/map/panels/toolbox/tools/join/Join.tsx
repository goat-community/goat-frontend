import React from "react";
import InputLayer from "@/components/map/panels/toolbox/tools/InputLayer";
import FieldsToMatch from "@/components/map/panels/toolbox/tools/join/FieldsToMatch";
import Statistics from "@/components/map/panels/toolbox/tools/join/Statistics";
import { Divider, useTheme, Box, Button } from "@mui/material";
// import { SendJoinFeatureRequest } from "@/lib/api/tools";
import { useTranslation } from "@/i18n/client";
// import SaveResult from "@/components/map/panels/toolbox/tools/SaveResult";
import { useForm } from "react-hook-form";

import type { PostJoin } from "@/lib/validations/tools";

// type ColumStatisticsOperation =
//   | "count"
//   | "sum"
//   | "mean"
//   | "median"
//   | "min"
//   | "max";

const Join = () => {
  // const [inputValues, setInputValues] = useState<string | string[]>(["", ""]);

  const theme = useTheme();
  const { t } = useTranslation("maps");

  const {
    // handleSubmit,
    register,
    // reset,
    // watch,
    getValues,
    // formState: { errors },
    // control,
  } = useForm<PostJoin>();

  const handleReset = () => {
    //   setInputValues(["", ""]);
    //   setFirstField(undefined);
    //   setSecondField(undefined);
    //   setMethod(undefined);
    //   setStatisticField(undefined);
  };

  const handleRun = () => {
    //   if (
    //     inputValues[0].length &&
    //     inputValues[1].length &&
    //     firstField &&
    //     secondField &&
    //     method &&
    //     statisticField
    //   ) {
    //     const requestBody: PostJoin = {
    //       target_layer_id: inputValues[0],
    //       target_field: firstField,
    //       join_layer_id: inputValues[1],
    //       join_field: secondField,
    //       column_statistics: {
    //         operation: method,
    //         field: statisticField,
    //       },
    //       result_target: {
    //         layer_name: outputName ? outputName : `${statisticField}_${method}`,
    //         folder_id: "159cc0f9-81e9-497d-8823-d9d37507ed54",
    //         project_id: projectId,
    //       },
    //     };
    //     console.log(requestBody);
    //     SendJoinFeatureRequest(requestBody);
    //   } else {
    //     console.log("Error: Not all fields are filled");
    //   }
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
          register={register}
          getValues={getValues}
          multiple
          // layerTypes={[]}
          // inputValues={inputValues}
          // setInputValues={setInputValues}
        />
        <Divider
          sx={{
            margin: `${theme.spacing(4)} 0px`,
            backgroundColor: `${theme.palette.primary.main}40`,
          }}
        />
        <FieldsToMatch
          register={register}
          getValues={getValues}
          // firstLayerId={inputValues[0]}
          // secondLayerId={inputValues[1]}
          // setSecondField={setSecondField}
          // setFirstField={setFirstField}
          // firstField={firstField}
          // secondField={secondField}
        />
        <Statistics
          register={register}
          getValues={getValues}
          // secondLayerId={inputValues[1]}
          // secondField={secondField}
          // setMethod={setMethod}
          // method={method}
          // setStatisticField={setStatisticField}
          // statisticField={statisticField}
        />
        {getValues("join_layer_id") &&
        getValues("column_statistics.operation") ? (
          <></>
        ) : // <SaveResult
        //   register={register}
        //   // getValues={getValues}
        //   // outputName={outputName}
        //   // setOutputName={setOutputName}
        //   // folderSaveId={folderSaveID}
        //   // setFolderSaveID={setFolderSaveID}
        // />
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

export default Join;
