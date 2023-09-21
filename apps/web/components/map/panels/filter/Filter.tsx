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
} from "@mui/material";
import Exppression from "./Exppression";
import { useDispatch, useSelector } from "react-redux";
import {
  setLogicalOperator,
  setFilters,
  addExpression,
  clearExpression,
} from "@/lib/store/mapFilters/slice";
import { v4 } from "uuid";
import type { IStore } from "@/types/store";
import type { SelectChangeEvent } from "@mui/material";

const FilterPanel = () => {
  const dispatch = useDispatch();
  const { expressions } = useSelector((state: IStore) => state.mapFilters);
  const [logicalOperator, setLogicalOperatorVal] = useState<string>(
    "match_all_expressions",
  );
  const sampleLayerID = "user_data.8c4ad0c86a2d4e60b42ad6fb8760a76e";

  const { keys } = useGetKeys({ layer_id: sampleLayerID });
  console.log(keys)
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

  return (
    <Container
      header={<Typography variant="h6">Filter</Typography>}
      body={
        <>
          <div>
            <Card>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing(2),
                  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
                }}
              >
                <Icon
                  iconName={ICON_NAME.STAR}
                  htmlColor={`${theme.palette.text.primary}4D`}
                />
                <Typography
                  variant="body2"
                  sx={{
                    width: "fit-content",
                  }}
                >
                  @content_label
                </Typography>
              </Box>
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
                  }}
                  label="Select attribute"
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

            {expressions ? (
              expressions.map((expression, indx) => (
                // <>
                <Exppression
                  isLast={indx + 1 !== expressions.length}
                  logicalOperator={logicalOperator}
                  id={`${indx + 1}`}
                  expression={expression}
                  key={v4()}
                  keys={keys}
                />
              ))
            ) : (
              <Box sx={{ marginTop: `${theme.spacing(4)}px` }}>
                <Card>
                  <CardMedia
                    sx={{
                      height: "56px",
                    }}
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQy9x3wyV5OWYWA8XxBJKMlH2QvuSSOIdOItRK1jgXSQ&s"
                  />
                  <Box
                    sx={{
                      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
                    }}
                  >
                    <Typography variant="body1">Filter your data</Typography>
                    <Typography
                      sx={{
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
