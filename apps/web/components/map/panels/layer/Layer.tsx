import Container from "@/components/map/panels/Container";

import { useState, useEffect } from "react";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import {
  Card,
  Checkbox,
  Stack,
  Typography,
  useTheme,
  Skeleton,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import { getFrequentValuesOnProperty, filterSearch } from "@/lib/utils/helpers";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { activateLayer, deactivateLayer } from "@/lib/store/layer/slice";
import AddLayer from "../../modals/AddLayer";
import FilterList from "./FilterList";
import { useTranslation } from "@/i18n/client";
import { setLayers } from "@/lib/store/layer/slice";
import { getProjectLayers } from "@/lib/api/projects";

import type { ChangeEvent } from "react";
import type { MapSidebarItem } from "@/types/map/sidebar";
import type { Layer } from "@/lib/validations/layer";
interface LoaderCheckerProps {
  children: React.ReactNode;
  projectLayers: Layer[] | null;
}

const LoaderChecker = (props: LoaderCheckerProps) => {
  const { children, projectLayers } = props;
  const theme = useTheme();

  return !projectLayers ? (
    <Box display="flex" flexDirection="column" gap={theme.spacing(2)}>
      <Skeleton variant="rectangular" width={245} height={60} />
      <Skeleton variant="rectangular" width={245} height={60} />
      <Skeleton variant="rectangular" width={245} height={60} />
    </Box>
  ) : (
    <>{children}</>
  );
};

interface PanelProps {
  onCollapse?: () => void;
  setActiveLeft: (item: MapSidebarItem | undefined) => void;
  projectId: string;
}

const LayerPanel = ({
  setActiveLeft,
  projectId
}: PanelProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchString, setSearchString] = useState<string>("");
  const { t } = useTranslation("maps");

  const [resultProjectLayers, setResultProjectLayers] = useState<
    Layer[] | null
  >(null);

  function filterConditionals(layer: Layer) {
    if (["none", "All"].includes(activeFilter)) {
      return true;
    } else if (activeFilter === layer.type) {
      return true;
    }
    return false;
  }

  function changeSearch(text: string) {
    setSearchString(text);
    setResultProjectLayers(
      filterSearch(resultProjectLayers ? resultProjectLayers : [], "name", text),
    );
  }

  function toggleLayerView(checked: boolean, layer: Layer) {
    const updatedLayers = resultProjectLayers?.map((projLayer) =>
      projLayer.name === layer.name
        ? { ...projLayer, active: checked }
        : projLayer,
    );

    if (updatedLayers) {
      setResultProjectLayers(updatedLayers);
      dispatch(checked ? activateLayer(layer) : deactivateLayer(layer));
    }
  }

  useEffect(() => {
    getProjectLayers(projectId).then((data) => {
      console.log(data)
      const layers = data.map((layer) => ({ ...layer, active: false }));
      setResultProjectLayers(layers);
      dispatch(setLayers(layers));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      title="Layers"
      close={setActiveLeft}
      direction="left"
      body={
        <>
          <Box>
            <Box>
              <AddLayer />
              <FormControl
                sx={{ width: "100%", marginBottom: theme.spacing(3) }}
                variant="outlined"
                size="small"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  {t("search")}
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type="text"
                  endAdornment={
                    <InputAdornment position="end">
                      <Icon
                        iconName={ICON_NAME.SEARCH}
                        fontSize="small"
                        htmlColor={`${theme.palette.secondary.light}aa`}
                      />
                    </InputAdornment>
                  }
                  value={searchString}
                  onChange={(
                    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
                  ) => changeSearch(e.target.value)}
                  label={t("search")}
                />
              </FormControl>
              <Box sx={{ display: "flex", gap: theme.spacing(2) }}>
                <FilterList
                  chips={[
                    "All",
                    ...getFrequentValuesOnProperty(
                      resultProjectLayers ? resultProjectLayers : [],
                      "type",
                    ),
                  ]}
                  setActiveFilter={setActiveFilter}
                  activeFilter={activeFilter}
                />
              </Box>
            </Box>
            <LoaderChecker projectLayers={resultProjectLayers}>
              {resultProjectLayers?.map((layer) =>
                filterConditionals(layer) ? (
                  <Card
                    key={layer.id}
                    sx={{
                      boxShadow: theme.shadows[5],
                      borderRadius: 0,
                      ":hover": {
                        boxShadow: theme.shadows[1],
                      },
                      cursor: "pointer",
                      padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
                      marginY: theme.spacing(2),
                    }}
                    variant="outlined"
                  >
                    <Stack
                      spacing={1}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: theme.spacing(2),
                        }}
                      >
                        <Checkbox
                          size="small"
                          checkedIcon={
                            <Icon
                              iconName={ICON_NAME.STAR}
                              fontSize="small"
                              htmlColor={theme.palette.primary.main}
                            />
                          }
                          icon={
                            <Icon
                              iconName={ICON_NAME.STAR}
                              fontSize="small"
                              htmlColor={`${theme.palette.primary.light}80`}
                            />
                          }
                        />

                        <Typography noWrap variant="body2">
                          {layer.name}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Checkbox
                          size="small"
                          onChange={(
                            _: ChangeEvent<HTMLInputElement>,
                            checked: boolean,
                          ) => toggleLayerView(checked, layer)}
                          checkedIcon={
                            <Icon
                              iconName={ICON_NAME.EYE}
                              fontSize="small"
                              sx={{
                                color: theme.palette.text.secondary,
                                "&:hover": {
                                  color: theme.palette.primary.main,
                                },
                              }}
                            />
                          }
                          icon={
                            <Icon
                              iconName={ICON_NAME.EYE_SLASH}
                              fontSize="small"
                              sx={{
                                color: theme.palette.text.secondary,
                                "&:hover": {
                                  color: theme.palette.primary.main,
                                },
                              }}
                            />
                          }
                        />
                      </Stack>
                    </Stack>
                  </Card>
                ) : null,
              )}
            </LoaderChecker>
          </Box>
        </>
      }
    />
  );
};

export default LayerPanel;
