import React, { useState } from "react";
import InputLayer from "@/components/map/panels/toolbox/tools/InputLayer";
import SelectArea from "@/components/map/panels/toolbox/tools/aggregate/SelectArea";
import Statistics from "@/components/map/panels/toolbox/tools/aggregate/Statistics";
import SaveResult from "@/components/map/panels/toolbox/tools/SaveResult";
import { Box, Button, useTheme } from "@mui/material";
import { useTranslation } from "@/i18n/client";
import { SendAggregateFeatureRequest } from "@/lib/api/tools";

import type {
  areaSelectionTypes,
  ColumStatisticsOperation,
} from "@/types/map/toolbox";
import type { PostAggregate } from "@/lib/validations/tools";

interface AggregateProps {
  projectId: string;
}

const Aggregate = (props: AggregateProps) => {
  const { projectId } = props;

  const [pointLayerId, setPointLayerId] = useState<string | string[]>("");
  const [area, setArea] = useState<areaSelectionTypes | undefined>(undefined);
  const [hexagonSize, setHexagonSize] = useState<string>("");
  const [polygonLayer, setPolygonLayer] = useState<string>("");
  const [fieldSelected, setFieldSelected] = useState<string>("");
  const [method, setMethod] = useState<ColumStatisticsOperation | undefined>(
    undefined,
  );
  const [groupedFields, setGroupedFields] = useState<string[] | undefined>(
    undefined,
  );
  const [outputName, setOutputName] = useState<string | undefined>("aggregate");
  const [folderSaveID, setFolderSaveID] = useState<string | undefined>(
    undefined,
  );

  const { t } = useTranslation("maps");

  const theme = useTheme();

  const handleReset = () => {
    setPointLayerId(["", ""]);
    setArea(undefined);
    setHexagonSize("");
    setMethod(undefined);
    setPolygonLayer("");
    setFieldSelected("");
    setGroupedFields(undefined);
    setOutputName(undefined);
    setFolderSaveID(undefined);
  };

  const handleRun = () => {
    if (
      pointLayerId &&
      area &&
      (hexagonSize || polygonLayer) &&
      fieldSelected &&
      method &&
      outputName &&
      folderSaveID
    ) {
      const requestBody: PostAggregate = {
        point_layer_id: typeof pointLayerId === "string" ? pointLayerId :"",
        area_type: area === t("panels.tools.aggregate.hexagon_bin") ? "h3_grid" : "feature_layer",
        column_statistics: {
          operation: method,
          field: fieldSelected,
        },
        result_target: {
          layer_name: outputName,
          folder_id: folderSaveID,
          project_id: projectId,
        },
      };

      if(area === t("panels.tools.aggregate.hexagon_bin")){
        requestBody.h3_resolution = parseInt(hexagonSize);
      }else{
        requestBody.area_layer_id = polygonLayer;
      }

      if(groupedFields && groupedFields.length){
        requestBody.area_group_by_field = groupedFields;
      }

      SendAggregateFeatureRequest(requestBody);
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
          layerTypes={["point"]}
          inputValues={pointLayerId}
          setInputValues={setPointLayerId}
        />
        <SelectArea
          pointLayerId={pointLayerId}
          area={area}
          setArea={setArea}
          setHexagonSize={setHexagonSize}
          hexagonSize={hexagonSize}
          setPolygonLayer={setPolygonLayer}
          polygonLayer={polygonLayer}
        />
        <Statistics
          pointLayerId={pointLayerId}
          field={fieldSelected}
          setFieldSelected={setFieldSelected}
          method={method}
          setMethod={setMethod}
          groupedFields={groupedFields}
          setGroupedFields={setGroupedFields}
        />
        {fieldSelected && method ? (
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

export default Aggregate;
