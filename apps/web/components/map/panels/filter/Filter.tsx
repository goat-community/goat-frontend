"use client";

import Container from "@/components/map/panels/Container";
import { useState } from "react";

import { ICON_NAME } from "@p4b/ui/components/Icon";
import { Icon } from "@p4b/ui/components/Icon";
import {
  Box,
  useTheme,
  Card,
  CardMedia,
  Button,
  Select,
  MenuItem,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import Exppression from "./Exppression";
import { useSelector, useDispatch } from "react-redux";
import { v4 } from "uuid";
import type { IStore } from "@/types/store";
import type { SelectChangeEvent } from "@mui/material";
import type { MapSidebarItem } from "@/types/map/sidebar";

import HistogramSlider from "./histogramSlider/HistogramSlider";
import { histogramData } from "@/public/assets/data/histogramSample";
import { useGetLayerKeys } from "@/lib/api/filter";
import { useFilterExpressions } from "@/hooks/map/FilteringHooks";
import { useFilterQueryExpressions } from "@/lib/api/filter";
import { useTranslation } from "@/i18n/client";
import { usePathname } from "next/navigation";
import { setMapLoading } from "@/lib/store/map/slice";

interface FilterPanelProps {
  setActiveRight: (item: MapSidebarItem | undefined) => void;
  projectId: string;
}

const FilterPanel = (props: FilterPanelProps) => {
  const { setActiveRight, projectId } = props;
  const pathname = usePathname();
  const { t } = useTranslation(pathname.split("/")[1], "maps");

  const dispatch = useDispatch();

  const {
    createExpression,
    updateProjectLayerQuery,
    deleteAnExpression,
    duplicateAnExpression,
  } = useFilterExpressions();

  const { layerToBeFiltered } = useSelector(
    (state: IStore) => state.mapFilters,
  );

  const { data: updatedData, mutate } = useFilterQueryExpressions(
    projectId,
    layerToBeFiltered,
  );
  
  console.log(updatedData)

  const [logicalOperator, setLogicalOperatorVal] = useState<string>(
    "match_all_expressions",
  );
  const [histogramState, setHistogramState] = useState({
    value: [162, 14000],
    showOverlay: false,
    data: {
      data: histogramData,
      min: 162,
      max: 14000,
      step: 1,
      distance: 1200,
    },
  });
  const sampleLayerID = "user_data.4d76705b973643a393dffd14e10f6604";
  // 4d76705b-9736-43a3-93df-fd14e10f6604
  const { keys } = useGetLayerKeys(sampleLayerID);
  const theme = useTheme();

  const logicalOperatorOptions: { label: React.ReactNode; value: string }[] = [
    {
      label: t("panels.filter.match_all_expressions"),
      value: "match_all_expressions",
    },
    {
      label: t("panels.filter.match_at_least_one_expressions"),
      value: "match_at_least_one_expression",
    },
  ];

  const createAnExpression = async () => {
    await createExpression(projectId, layerToBeFiltered);
    mutate();
    // dispatch(setMapLoading(true))
  }

  function handleOperatorChange(event: SelectChangeEvent<string>) {
    setLogicalOperatorVal(event.target.value);
  }

  const cleanExpressions = async () => {
    await updateProjectLayerQuery(
      layerToBeFiltered,
      projectId,
      `{"query": {} }`,
    );
    mutate();
    dispatch(setMapLoading(true))
  };

  const deleteOneExpression = async (id: string) => {
    await deleteAnExpression(id, projectId, layerToBeFiltered);
    mutate();
    dispatch(setMapLoading(true))
  };

  const duplicateOneExpression = async (id: string) => {
    await duplicateAnExpression(id, projectId, layerToBeFiltered);
    mutate();
    dispatch(setMapLoading(true))
  }

  return (
    <Container
      title={t("panels.filter.filter")}
      close={setActiveRight}
      body={
        <>
          <div>
            <Card
              sx={{
                paddingLeft: theme.spacing(2),
                backgroundColor: `${theme.palette.background.default}80`,
              }}
            >
              <RadioGroup aria-label="options" name="options">
                <FormControlLabel
                  value="@content_label"
                  sx={{
                    span: {
                      fontSize: "12px",
                      fontStyle: "italic",
                    },
                  }}
                  control={
                    <Radio
                      color="default"
                      icon={
                        <Icon
                          iconName={ICON_NAME.STAR}
                          htmlColor={theme.palette.primary.dark}
                          sx={{ fontSize: "18px" }}
                        />
                      }
                      checkedIcon={
                        <Icon
                          iconName={ICON_NAME.STAR}
                          htmlColor={theme.palette.primary.main}
                          sx={{ fontSize: "18px" }}
                        />
                      }
                    />
                  }
                  label="@content_label"
                />
              </RadioGroup>
            </Card>

            {updatedData && updatedData.length > 1 ? (
              <>
                <Typography
                  variant="body2"
                  sx={{
                    marginTop: "24px",
                    color: theme.palette.text.secondary,
                    fontWeight: "600",
                  }}
                >
                  {t("panels.filter.filter")}
                </Typography>
                <Select
                  sx={{
                    margin: `${theme.spacing(2)}px 0`,
                    width: "100%",
                  }}
                  label="Select condition"
                  size="small"
                  defaultValue={logicalOperator ? logicalOperator : ""}
                  onChange={handleOperatorChange}
                >
                  {logicalOperatorOptions.map((key) => (
                    <MenuItem key={v4()} value={key.value}>
                      {key.label}
                    </MenuItem>
                  ))}
                </Select>
              </>
            ) : null}
            {updatedData && updatedData.length ? (
              updatedData.map((expression, indx) => (
                <Exppression
                  isLast={indx + 1 !== updatedData.length}
                  logicalOperator={logicalOperator}
                  id={expression.id}
                  expression={expression}
                  deleteOneExpression={deleteOneExpression}
                  duplicateExpression={duplicateOneExpression}
                  key={v4()}
                  keys={keys}
                />
              ))
            ) : (
              <Box sx={{ marginTop: `${theme.spacing(4)}` }}>
                <Card
                  sx={{ backgroundColor: theme.palette.background.default }}
                >
                  <CardMedia
                    sx={{
                      height: "56px",
                    }}
                    image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQy9x3wyV5OWYWA8XxBJKMlH2QvuSSOIdOItRK1jgXSQ&s"
                  />
                  <Box
                    sx={{
                      padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
                    }}
                  >
                    <Typography variant="body1">{t("panels.filter.filter_your_data")}</Typography>
                    <Typography
                      sx={{
                        letterSpacing: "0.15px",
                        fontSize: "11px",
                        lineHeight: "175%",
                        fontStyle: "italic",
                        color: theme.palette.text.secondary,
                        paddingTop: theme.spacing(3),
                        paddingBottom: theme.spacing(2),
                      }}
                      variant="subtitle2"
                    >
                      {t("panels.filter.message")}
                    </Typography>
                  </Box>
                </Card>
              </Box>
            )}
            <HistogramSlider
              min={histogramState.data.min}
              max={histogramState.data.max}
              step={histogramState.data.step}
              value={histogramState.value as [number, number]}
              distance={histogramState.data.distance}
              data={histogramState.data.data}
              colors={{
                in: "#99ccc7",
                out: "#cceae8",
              }}
              onChange={(value: [number, number]) => {
                histogramState.value = value;
                setHistogramState(histogramState);
              }}
            />
            <Button
              sx={{
                width: "100%",
                marginTop: theme.spacing(4),
              }}
              onClick={createAnExpression}
            >
              {t("panels.filter.add_expression")}
            </Button>
          </div>
          {updatedData && updatedData.length ? (
            <Button
              color="secondary"
              sx={{
                width: "100%",
                marginTop: theme.spacing(4),
              }}
              onClick={cleanExpressions}
            >
              {t("panels.filter.clear_filter")}
            </Button>
          ) : null}
        </>
      }
    />
  );
};

export default FilterPanel;
