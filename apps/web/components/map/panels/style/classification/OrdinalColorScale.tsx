import { OverflowTypograpy } from "@/components/common/OverflowTypography";
import { LayerValueSelectorPopper } from "@/components/map/panels/style/other/LayerValueSelectorPopper";
import { SingleColorPopper } from "@/components/map/panels/style/other/SingleColorPopper";
import { SortableItem } from "@/components/map/panels/style/other/SortableItem";
import SortableWrapper from "@/components/map/panels/style/other/SortableWrapper";
import StyleDropdownFooter from "@/components/map/panels/style/other/StyleDropdownFooter";
import { useTranslation } from "@/i18n/client";
import { isValidHex } from "@/lib/utils/helpers";
import type { ClassBreaks } from "@/lib/validations/layer";
import { classBreaks } from "@/lib/validations/layer";
import type {
  ColorItem,
  ColorMap,
  ColorMapItem,
  ColorScaleSelectorProps,
} from "@/types/map/color";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import React from "react";
import { v4 } from "uuid";

type OrdinalColorScaleProps = ColorScaleSelectorProps & {
  setIsClickAwayEnabled: (isClickAwayEnabled: boolean) => void;
  onCancel?: () => void;
};

const OrdinalColorScale = (props: OrdinalColorScaleProps) => {
  const { colorSet, activeLayerField, activeLayerId } = props;
  const { t } = useTranslation("maps");
  const [colorMaps, setColorMaps] = React.useState<ColorMapItem[]>(
    colorSet.selectedColor.color_map?.map((colorMap: ColorMap) => {
      return {
        id: v4(),
        value: colorMap[0],
        color: colorMap[1],
      };
    }) || [],
  );

  const classBreakOptions = React.useMemo(() => {
    return activeLayerField?.type === "number"
      ? classBreaks.options
      : [classBreaks.Enum.ordinal];
  }, [activeLayerField]);

  const [editingColorItem, setEditingColorItem] =
    React.useState<ColorItem | null>(null);
  const [editingValues, setEditingValues] = React.useState<string[] | null>(
    null,
  );
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  function onInputHexChange(item: ColorItem) {
    const index = colorMaps.findIndex(
      (color: ColorMapItem) => color.id === item.id,
    );
    if (index !== -1) {
      const newColorMaps = [...colorMaps];
      newColorMaps[index] = {
        ...newColorMaps[index],
        color: item.color,
      };
      setColorMaps(newColorMaps);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const oldIndex = colorMaps.findIndex((color) => color.id === active.id);
    const newIndex = colorMaps.findIndex((color) => color.id === over?.id);
    const newOrderArray = arrayMove(colorMaps, oldIndex, newIndex);
    setColorMaps(newOrderArray);
  }

  function deleteStep(item: ColorItem) {
    if (colorMaps.length === 2) {
      return;
    }
    const index = colorMaps.findIndex((color) => color.id === item.id);
    if (index !== -1) {
      const newColorMaps = [...colorMaps];
      newColorMaps.splice(index, 1);
      setColorMaps(newColorMaps);
    }
  }

  const handleColorPicker = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    item: ColorItem,
  ) => {
    setEditingColorItem(item);
    setAnchorEl(event.currentTarget);
  };

  const handleValueSelector = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    item: ColorMapItem,
  ) => {
    const value = Array.isArray(item.value) ? item.value : [item.value];
    setEditingValues(value);
    setAnchorEl(event.currentTarget);
  };

  const handleAddStep = () => {
    const newColorMaps = [...colorMaps];
    const lastColorMap = newColorMaps[newColorMaps.length - 1];
    newColorMaps.push({
      id: v4(),
      value: "",
      color: lastColorMap.color,
    });
    setColorMaps(newColorMaps);
  };

  const areColorsValid = React.useMemo(() => {
    let isValid = true;
    colorMaps.forEach((item) => {
      if (!isValidHex(item.color)) {
        isValid = false;
      }
    });
    return isValid;
  }, [colorMaps]);

  function onCancel() {
    props.onCancel && props.onCancel();
  }

  function onApply() {
    console.log(colorSet)
    console.log(colorMaps)
  }

  return (
    <>
      <SingleColorPopper
        editingItem={editingColorItem}
        anchorEl={anchorEl}
        onInputHexChange={onInputHexChange}
      />
      {editingValues && (
        <LayerValueSelectorPopper
          layerId={activeLayerId}
          selectedValues={editingValues}
          fieldName={activeLayerField?.name || ""}
          anchorEl={anchorEl}
          onSelectedValuesChange={() => {}}
        />
      )}
      <Box
        sx={{ py: 3 }}
        onClick={() => {
          setEditingValues(null);
          setEditingColorItem(null);
        }}
      >
        <Box sx={{ px: 3, pb: 3 }}>
          <Select
            fullWidth
            size="small"
            IconComponent={() => null}
            value={props.selectedColorScaleMethod}
            onOpen={() => {
              props.setIsClickAwayEnabled && props.setIsClickAwayEnabled(false);
            }}
            MenuProps={{
              TransitionProps: {
                onExited: () => {
                  props.setIsClickAwayEnabled &&
                    props.setIsClickAwayEnabled(true);
                },
              },
            }}
            onChange={(e) => {
              props.setSelectedColorScaleMethod(e.target.value as ClassBreaks);
            }}
          >
            {classBreakOptions.map((option, index) => (
              <MenuItem key={index} value={String(option)}>
                {t(`${option}`)}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box sx={{ maxHeight: "340px", overflowY: "auto" }}>
          <SortableWrapper handleDragEnd={handleDragEnd} items={colorMaps}>
            {colorMaps?.map((item: ColorMapItem) => (
              <SortableItem
                active={item.id === editingColorItem?.id}
                key={item.id}
                item={item}
                label={item.color}
                colorLegend={
                  <>
                    <Box
                      onClick={(e) => {
                        setEditingValues(null);
                        e.stopPropagation();
                        const colorItem = {
                          id: item.id,
                          color: item.color,
                        } as ColorItem;
                        handleColorPicker(e, colorItem);
                      }}
                      sx={{
                        height: "20px",
                        width: "32px",
                        borderRadius: "4px",
                        backgroundColor: item.color,
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                    />
                  </>
                }
                actions={
                  <>
                    <IconButton size="small" onClick={() => deleteStep(item)}>
                      <Icon
                        iconName={ICON_NAME.TRASH}
                        style={{
                          fontSize: 12,
                        }}
                        htmlColor="inherit"
                      />
                    </IconButton>
                  </>
                }
              >
                <Stack
                  direction="row"
                  sx={{
                    py: 1,
                    pr: 0,
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  <OverflowTypograpy
                    variant="body2"
                    fontWeight="bold"
                    onClick={(e) => {
                      setEditingColorItem(null);
                      e.stopPropagation();
                      handleValueSelector(e, item);
                    }}
                    tooltipProps={{
                      placement: "top",
                      arrow: true,
                      enterDelay: 200,
                    }}
                  >
                    <>{item.value || t("assign_values")}</>
                  </OverflowTypograpy>
                </Stack>
              </SortableItem>
            ))}
          </SortableWrapper>
          <Button
            onClick={handleAddStep}
            variant="text"
            sx={{ borderRadius: 0, ml: 4, my: 2 }}
            size="small"
            startIcon={
              <Icon iconName={ICON_NAME.PLUS} style={{ fontSize: "15px" }} />
            }
          >
            <Typography variant="body2" fontWeight="bold" color="inherit">
              {t("maps:add_step")}
            </Typography>
          </Button>
        </Box>
        <StyleDropdownFooter
          isValid={areColorsValid}
          onCancel={onCancel}
          onApply={onApply}
        />
      </Box>
    </>
  );
};

export default OrdinalColorScale;
