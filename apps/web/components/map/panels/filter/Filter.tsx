import { useMemo } from "react";
import { setActiveLeftPanel } from "@/lib/store/map/slice";
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
} from "@mui/material";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import ExpressionList from "@/components/map/panels/filter/ExpressionList";

import type { LayerExpressions } from "@/lib/validations/filter";

interface FilterProps {
  projectId: string;
}

const FilterPanel = (props: FilterProps) => {
  const { projectId } = props;

  const dispatch = useAppDispatch();
  const { t } = useTranslation("maps");
  const theme = useTheme();

  const {
    // register,
    // reset,
    watch,
    // getValues,
    setValue,
    // formState: { errors },
  } = useForm<LayerExpressions>({
    defaultValues: {
      expressions: [],
    },
  });

  const watchFormValues = watch();

  const getCurrentValues = useMemo(() => {
    return watchFormValues;
  }, [watchFormValues]);

  function createExpression() {
    setValue("expressions", [...getCurrentValues.expressions, {
      id: v4(),
      value: "",
      attribute: "",
      expression: "",
    }])
  }

  return (
    <Container
      title={t("panels.filter.filter")}
      close={() => dispatch(setActiveLeftPanel(undefined))}
      body={
        <>
          <ProjectLayerDropdown projectId={projectId} />
          {getCurrentValues.expressions.length ? (
            <ExpressionList expressions={getCurrentValues} setValue={setValue}/>
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
        </>
      }
      action={
        <>
          <Button variant="outlined" fullWidth onClick={createExpression}>
            Create Expression
          </Button>
        </>
      }
      disablePadding
    />
  );
};

export default FilterPanel;
