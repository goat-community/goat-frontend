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
  ListItemIcon,
  MenuItem,
  MenuList,
  Menu,
  ClickAwayListener,
} from "@mui/material";
import { v4 } from "uuid";
import Expression from "@/components/map/panels/filter/Expression";
import { createTheCQLBasedOnExpression } from "@/lib/utils/filtering/filtering_cql";
import { updateProjectLayer } from "@/lib/api/projects";
import { parseCQLQueryToObject } from "@/lib/utils/filtering/cql_to_expression";
import { useGetLayerKeys } from "@/hooks/map/ToolsHooks";
import { useFilterQueries } from "@/hooks/map/LayerPanelHooks";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

import type { Expression as ExpressionType } from "@/lib/validations/filter";
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logicalOperator, setLogicalOperator] = useState<"and" | "or">("and");

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useAppDispatch();
  const { activeLayer, mutate } = useFilterQueries(projectId as string);
  const { t } = useTranslation("maps");
  const theme = useTheme();

  function createExpression(type: "spatial" | "regular") {
    if (expressions) {
      setExpressions([
        ...expressions,
        {
          id: v4(),
          attribute: "",
          expression: "",
          value: "",
          type,
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
    if (expressions) {
      setExpressions([
        ...expressions,
        {
          expression: expression.expression,
          attribute: expression.attribute,
          value: expression.value,
          id: v4(),
          type: expression.type,
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

  function handleLayerChange() {
    const existingExpressions = parseCQLQueryToObject(
      activeLayer && "query" in activeLayer
        ? (activeLayer.query as { op: string; args: unknown[] })
        : undefined,
    );
    setExpressions(existingExpressions);
  }

  return (
    <Container
      title={t("panels.filter.filter")}
      close={() => dispatch(setActiveRightPanel(undefined))}
      body={
        <>
          <ProjectLayerDropdown
            projectId={projectId}
            onChange={handleLayerChange}
          />
          {expressions && expressions.length > 1 ? (
            <FormControl fullWidth>
              <InputLabel>{t("panels.filter.logical_operator")}</InputLabel>
              <Select
                value={logicalOperator}
                label={t("panels.filter.logical_operator")}
                onChange={(event: SelectChangeEvent) => {
                  setLogicalOperator(event.target.value as "or" | "and");
                }}
              >
                <MenuItem key={v4()} value="and">
                  {t("panels.filter.and")}
                </MenuItem>
                <MenuItem key={v4()} value="or">
                  {t("panels.filter.or")}
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
            <Button
              onClick={handleClick}
              fullWidth
              startIcon={
                <Icon iconName={ICON_NAME.PLUS} style={{ fontSize: "15px" }} />
              }
            >
              <Typography variant="body2" fontWeight="bold" color="inherit">
                {t("panels.filter.create_expression")}
              </Typography>
            </Button>
            <Menu
              anchorEl={anchorEl}
              sx={{
                "& .MuiPaper-root": {
                  boxShadow: "0px 0px 10px 0px rgba(58, 53, 65, 0.1)",
                },
              }}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              transformOrigin={{ vertical: "bottom", horizontal: "center" }}
              open={open}
              MenuListProps={{
                "aria-labelledby": "basic-button",
                sx: { width: anchorEl && anchorEl.offsetWidth - 10, p: 0 },
              }}
              onClose={handleClose}
            >
              <Box>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList>
                    <MenuItem onClick={() => createExpression("regular")}>
                      <ListItemIcon>
                        <Icon
                          iconName={ICON_NAME.EDITPEN}
                          style={{ fontSize: "15px" }}
                        />
                      </ListItemIcon>
                      <Typography variant="body2">
                      {t("panels.filter.logical_expression")}
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={() => createExpression("spatial")}>
                      <ListItemIcon>
                        <Icon
                          iconName={ICON_NAME.MOUNTAIN}
                          style={{ fontSize: "15px" }}
                        />
                      </ListItemIcon>
                      <Typography variant="body2">
                        {t("panels.filter.spatial_expression")}
                      </Typography>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Box>
            </Menu>
            <Button
              variant="outlined"
              fullWidth
              color="error"
              disabled={!expressions || !expressions.length}
              onClick={() => setExpressions([])}
            >
              {t("panels.filter.clear_filter")}
            </Button>
          </Box>
        </>
      }
    />
  );
};

export default FilterPanel;
