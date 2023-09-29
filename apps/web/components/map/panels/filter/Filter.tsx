"use client";

import Container from "@/components/map/panels/Container";
import { useState } from "react";

import { useGetKeys } from "@/hooks/map/FilteringHooks";

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
import { useDispatch, useSelector } from "react-redux";
import {
  setLogicalOperator,
  setFilters,
  addExpression,
  clearExpression,
  removeFilter,
  removeExpressionById,
  duplicateExpression,
} from "@/lib/store/mapFilters/slice";
import { v4 } from "uuid";
import type { IStore } from "@/types/store";
import type { SelectChangeEvent } from "@mui/material";
import type { MapSidebarItem } from "@/types/map/sidebar";

import HistogramSlider from "./histogramSlider/HistogramSlider";
import { histogramData } from "@/public/assets/data/histogramSample";

interface FilterPanelProps {
  setActiveRight: (item: MapSidebarItem | undefined) => void;
}

const FilterPanel = (props: FilterPanelProps) => {
  const { setActiveRight } = props;

  const dispatch = useDispatch();
  const { expressions } = useSelector((state: IStore) => state.mapFilters);
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
  const sampleLayerID = "user_data.8c4ad0c86a2d4e60b42ad6fb8760a76e";

  const { keys } = useGetKeys({ layer_id: sampleLayerID });
  const theme = useTheme();

  const logicalOperatorOptions: { label: React.ReactNode; value: string }[] = [
    {
      label: "Match all expressions",
      value: "match_all_expressions",
    },
    {
      label: "Match at least one expression",
      value: "match_at_least_one_expression",
    },
  ];

  function createExpression() {
    dispatch(setLogicalOperator("match_all_expressions"));
    dispatch(
      addExpression({
        id: v4(),
        attribute: null,
        expression: null,
        value: null,
        firstInput: "",
        secondInput: "",
      }),
    );
  }

  function handleOperatorChange(event: SelectChangeEvent<string>) {
    setLogicalOperatorVal(event.target.value);
    dispatch(setLogicalOperator(event.target.value));
  }

  function cleanExpressions() {
    dispatch(clearExpression());
    dispatch(setFilters({}));
  }

  function deleteOneExpression(id: string) {
    dispatch(removeExpressionById(id));
    dispatch(removeFilter(id));
  }

  function duplicateOneExpression(id: string) {
    dispatch(duplicateExpression(id));
  }

  return (
    <Container
      title="Filter"
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

            {expressions && expressions.length > 1 ? (
              <>
                <Typography
                  variant="body2"
                  sx={{
                    marginTop: "24px",
                    color: theme.palette.text.secondary,
                    fontWeight: "600",
                  }}
                >
                  Filter
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

            {expressions.length ? (
              expressions.map((expression, indx) => (
                <Exppression
                  isLast={indx + 1 !== expressions.length}
                  logicalOperator={logicalOperator}
                  id={`${indx + 1}`}
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
                    <Typography variant="body1">Filter your data</Typography>
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
                      Perform targeted data analysis. Filter layers, apply an
                      expression and narrow down data displayed. Sort data and
                      hide data that does not match your criteria. Learn more
                    </Typography>
                  </Box>
                </Card>
              </Box>
            )}
            <HistogramSlider
              min={histogramState.data.min}
              max={histogramState.data.max}
              step={histogramState.data.step}
              value={histogramState.value}
              distance={histogramState.data.distance}
              data={histogramState.data.data}
              colors={{
                in: '#99ccc7',
                out: '#cceae8',
              }}
              onChange={(value: [number, number]) => {
                console.log(value)
                histogramState.value = value;
                setHistogramState(histogramState);
              }}
            />
            <Button
              sx={{
                width: "100%",
                marginTop: theme.spacing(4),
              }}
              onClick={createExpression}
            >
              Add Expression
            </Button>
          </div>
          {expressions && expressions.length ? (
            <Button
              color="secondary"
              sx={{
                width: "100%",
                marginTop: theme.spacing(4),
              }}
              onClick={cleanExpressions}
            >
              Clear Filter
            </Button>
          ) : null}
        </>
      }
    />
  );
};

export default FilterPanel;
