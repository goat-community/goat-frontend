import { useState, useEffect, useCallback } from "react";
import { setActiveRightPanel } from "@/lib/store/map/slice";
import { useAppDispatch } from "@/hooks/store/ContextHooks";
import Container from "@/components/map/panels/Container";
import { useTranslation } from "@/i18n/client";
import ProjectLayerDropdown from "@/components/map/panels/ProjectLayerDropdown";
import {
  Card,
  Typography,
  CardMedia,
  Box,
  useTheme,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { v4 } from "uuid";
import Expression from "@/components/map/panels/filter/Expression";
import { createTheCQLBasedOnExpression } from "@/lib/utils/filtering/filtering_cql";
import { updateProjectLayer } from "@/lib/api/projects";
import { parseCQLQueryToObject } from "@/lib/utils/filtering/cql_to_expression";
import { useGetLayerKeys } from "@/hooks/map/ToolsHooks";

import type { Expression as ExpressionType } from "@/lib/validations/filter";
import { useActiveLayer } from "@/hooks/map/LayerPanelHooks";
import type { SelectChangeEvent } from "@mui/material";
import type { ProjectLayer } from "@/lib/validations/project";

interface FilterProps {
  projectId: string;
}

const FilterPanel = (props: FilterProps) => {
  const { projectId } = props;

  const [expressions, setExpressions] = useState<ExpressionType[] | undefined>(
    undefined,
  );
  const [logicalOperator, setLogicalOperator] = useState<"and" | "or">("and");

  const dispatch = useAppDispatch();
  const { activeLayer, mutate } = useActiveLayer(projectId as string);
  const { t } = useTranslation("maps");
  const theme = useTheme();

  function createExpression() {
    if (expressions) {
      setExpressions([
        ...expressions,
        {
          id: v4(),
          attribute: "",
          expression: "",
          value: "",
        },
      ]);
    }
  }

  const modifyExpressions = useCallback(
    (expression: ExpressionType, key: string, value: string) => {
      if (key === "expression" || key === "attribute") {
        expression.value = "";
      }
      const modifiedExpression = { ...expression, [key]: value };
      setExpressions(
        expressions &&
          expressions.map((express) =>
            express.id === modifiedExpression.id ? modifiedExpression : express,
          ),
      );
    },
    [expressions],
  );

  const deleteOneExpression = (expression: ExpressionType) => {
    const newExpressions = expressions?.filter(
      (expr) => expr.id !== expression.id,
    );
    setExpressions(newExpressions);
  };

  const duplicateExpression = (expression: ExpressionType) => {
    // const newExpressions = expressions?.filter((expr)=>expr.id !== expression.id)
    if (expressions) {
      setExpressions([
        ...expressions,
        {
          expression: expression.expression,
          attribute: expression.attribute,
          value: expression.value,
          id: v4(),
        },
      ]);
    }
  };

  const layerAttributes = useGetLayerKeys(
    `user_data.${(activeLayer ? activeLayer.layer_id : "")
      .split("-")
      .join("")}`,
  );

  const updateExpressions = () => {
    if (!expressions) {
      const existingExpressions = parseCQLQueryToObject(
        activeLayer && "query" in activeLayer
          ? (activeLayer.query as { op: string; args: unknown[] })
          : undefined,
      );
      setExpressions(existingExpressions);
    } else {
      const query = createTheCQLBasedOnExpression(
        expressions,
        layerAttributes,
        logicalOperator,
      );
      setLogicalOperator("op" in query ? (query.op as "and" | "or") : "and");

      const updatedProjectLayer = {
        ...activeLayer,
        query: expressions.length ? query : null,
      };

      updateProjectLayer(
        projectId,
        activeLayer ? activeLayer.id : 0,
        updatedProjectLayer as ProjectLayer,
      );
    }
    setTimeout(() => {
      mutate();
    }, 300);
  };

  useEffect(() => {
    updateExpressions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expressions, logicalOperator]);

  useEffect(() => {
    // setExpressions(undefined);
    const existingExpressions = parseCQLQueryToObject(
      activeLayer && "query" in activeLayer
        ? (activeLayer.query as { op: string; args: unknown[] })
        : undefined,
    );
    setExpressions(existingExpressions);
    // updateExpressions();
  }, [activeLayer]);

  return (
    <Container
      title={t("panels.filter.filter")}
      close={() => dispatch(setActiveRightPanel(undefined))}
      body={
        <>
          <ProjectLayerDropdown projectId={projectId} />
          {expressions && expressions.length > 1 ? (
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Logical Operator
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={logicalOperator}
                label="Logical Operator"
                onChange={(event: SelectChangeEvent) => {
                  setLogicalOperator(event.target.value as "or" | "and");
                }}
              >
                <MenuItem key={v4()} value="and">
                  And
                </MenuItem>
                <MenuItem key={v4()} value="or">
                  Or
                </MenuItem>
              </Select>
            </FormControl>
          ) : null}
          {expressions && expressions.length ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing(6),
                my: theme.spacing(6),
              }}
            >
              {expressions.map((expression) => (
                <Expression
                  key={expression.id}
                  expression={expression}
                  modifyExpression={modifyExpressions}
                  deleteOneExpression={deleteOneExpression}
                  duplicateExpression={duplicateExpression}
                />
              ))}
            </Box>
          ) : (
            <Box sx={{ marginTop: `${theme.spacing(4)}` }}>
              <Card sx={{ backgroundColor: theme.palette.background.default }}>
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
                  <Typography variant="body1">
                    {t("panels.filter.filter_your_data")}
                  </Typography>
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: theme.spacing(2),
              marginTop: theme.spacing(5),
            }}
          >
            <Button variant="outlined" fullWidth onClick={createExpression}>
              Create Expression
            </Button>
            <Button
              variant="outlined"
              fullWidth
              color="error"
              disabled={!expressions || !expressions.length}
              onClick={() => setExpressions([])}
            >
              Clear Expression
            </Button>
          </Box>
        </>
      }
      // disablePadding
    />
  );
};

export default FilterPanel;
