import { Legend } from "@/components/map/controls/Legend";
import Container from "@/components/map/panels/Container";
import ProjectLayerDropdown from "@/components/map/panels/ProjectLayerDropdown";
import { useActiveLayer } from "@/hooks/map/LayerPanelHooks";
import { useAppDispatch } from "@/hooks/store/ContextHooks";
import { useTranslation } from "@/i18n/client";
import { updateProjectLayer, useProjectLayers } from "@/lib/api/projects";
import { setActiveRightPanel } from "@/lib/store/map/slice";
import type { ProjectLayer } from "@/lib/validations/project";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useMemo, type ReactNode, useState } from "react";
import { v4 } from "uuid";

const AccordionHeader = ({ title }: { title: string }) => {
  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <Typography variant="body2" fontWeight="bold">
        {title}
      </Typography>
    </Stack>
  );
};

const AccordionWrapper = ({
  header,
  body,
}: {
  header: ReactNode;
  body: ReactNode;
}) => {
  return (
    <Accordion square={false}>
      <AccordionSummary
        sx={{
          my: 0,
          py: 0,
        }}
        expandIcon={
          <Icon
            iconName={ICON_NAME.CHEVRON_DOWN}
            style={{ fontSize: "15px" }}
          />
        }
        aria-controls="panel1a-content"
      >
        {header}
      </AccordionSummary>
      <Divider sx={{ mt: 0, pt: 0 }} />
      <AccordionDetails sx={{ pt: 0, mt: 0 }}>{body}</AccordionDetails>
    </Accordion>
  );
};

const LayerInfo = ({ layer }: { layer: ProjectLayer }) => {
  const { t } = useTranslation("maps");
  return (
    <AccordionWrapper
      header={
        <>
          <AccordionHeader title="Layer Info" />
        </>
      }
      body={
        <>
          <Stack spacing={2}>
            <Typography variant="body2" fontWeight="bold">
              Dataset Source
            </Typography>
            <Typography variant="body2">{layer.name}</Typography>
            <Typography variant="body2" fontWeight="bold">
              Type
            </Typography>
            <Typography variant="body2">{t(layer.type)}</Typography>
          </Stack>
        </>
      }
    />
  );
};

const Visibility = ({
  layer,
  projectId,
}: {
  layer: ProjectLayer;
  projectId: string;
}) => {
  const { layers: projectLayers, mutate: mutateProjectLayers } =
    useProjectLayers(projectId);
  const layerType = layer.type;

  const opacity = useMemo(() => {
    if (!layer.properties.opacity) return 80;
    return layer.properties.opacity * 100;
  }, [layer.properties.opacity]);

  const visibilityRange = useMemo(() => {
    const minZoom = layer.properties.min_zoom || 0;
    const maxZoom = layer.properties.max_zoom || 22;
    return [minZoom, maxZoom];
  }, [layer.properties.min_zoom, layer.properties.max_zoom]);

  const [opacityValue, setOpacityValue] = useState<number>(opacity);
  const [visibilityRangeValue, setVisibilityRangeValue] =
    useState<number[]>(visibilityRange);

  const changeOpacity = async (value: number) => {
    const layers = JSON.parse(JSON.stringify(projectLayers));
    const index = layers.findIndex((l) => l.id === layer.id);
    const layerToUpdate = layers[index];
    layerToUpdate.updated_at = v4(); // temporary key until update_at is
    if (!layerToUpdate.properties.paint) {
      layerToUpdate.properties.paint = {};
    }
    layerToUpdate.properties.paint[`${layerType}-opacity`] = value / 100;
    await mutateProjectLayers(layers, false);
    await updateProjectLayer(projectId, layer.id, layerToUpdate);
  };

  const changeVisibilityRangeValue = async (value: number[]) => {
    const layers = JSON.parse(JSON.stringify(projectLayers));
    const index = layers.findIndex((l) => l.id === layer.id);
    const layerToUpdate = layers[index];
    layerToUpdate.updated_at = v4(); // temporary key until update_at is
    layerToUpdate.properties.minzoom = value[0];
    layerToUpdate.properties.maxzoom = value[1];
    await mutateProjectLayers(layers, false);
    await updateProjectLayer(projectId, layer.id, layerToUpdate);
  };

  const marks = [
    {
      value: 25,
      label: "25%",
    },
    {
      value: 50,
      label: "50%",
    },
    {
      value: 75,
      label: "75%",
    },
  ];

  return (
    <AccordionWrapper
      header={<AccordionHeader title="Visibility" />}
      body={
        <Stack spacing={4}>
          <Box>
            <Typography variant="body2">Opacity</Typography>
            <Box sx={{ px: 2, mt: 2 }}>
              <Slider
                aria-label="Layer Opacity"
                value={opacityValue}
                onChange={(_event: Event, newValue: number | number[]) => {
                  setOpacityValue(newValue as number);
                }}
                onChangeCommitted={(_event: Event, value: number | number[]) =>
                  changeOpacity(value as number)
                }
                step={1}
                valueLabelDisplay="auto"
                marks={marks}
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="body2">Visibility Range</Typography>
            <Box sx={{ px: 2, mt: 2 }}>
              <Slider
                getAriaLabel={() => "Visibility Range"}
                value={visibilityRangeValue}
                min={0}
                max={22}
                onChange={(_event: Event, newValue: number | number[]) => {
                  setVisibilityRangeValue(newValue as number[]);
                }}
                onChangeCommitted={(_event: Event, value: number | number[]) =>
                  changeVisibilityRangeValue(value as number[])
                }
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>
          </Box>
        </Stack>
      }
    />
  );
};

const Symbology = ({ layer }: { layer: ProjectLayer }) => {
  return (
    <AccordionWrapper
      header={<AccordionHeader title="Symbology" />}
      body={<>{layer && <Legend layers={[layer]} />}</>}
    />
  );
};

const PropertiesPanel = ({ projectId }: { projectId: string }) => {
  const dispatch = useAppDispatch();
  const { activeLayer } = useActiveLayer(projectId);
  return (
    <Container
      title="Properties"
      direction="right"
      disablePadding={true}
      close={() => dispatch(setActiveRightPanel(undefined))}
      body={
        <>
          {activeLayer && (
            <>
              <ProjectLayerDropdown projectId={projectId} />
              <LayerInfo layer={activeLayer} />
              <Symbology layer={activeLayer} />
              <Visibility layer={activeLayer} projectId={projectId} />
            </>
          )}
        </>
      }
    />
  );
};

export default PropertiesPanel;
