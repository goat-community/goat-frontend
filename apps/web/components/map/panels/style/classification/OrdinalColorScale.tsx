import { OverflowTypograpy } from "@/components/common/OverflowTypography";
import DropdownFooter from "@/components/map/panels/style/other/DropdownFooter";
import { LayerValueSelectorPopper } from "@/components/map/panels/style/other/LayerValueSelectorPopper";
import { SingleColorPopper } from "@/components/map/panels/style/other/SingleColorPopper";
import { SortableItem } from "@/components/map/panels/style/other/SortableItem";
import SortableWrapper from "@/components/map/panels/style/other/SortableWrapper";
import { useTranslation } from "@/i18n/client";
import { isValidHex } from "@/lib/utils/helpers";
import type { ClassBreaks, ColorMap } from "@/lib/validations/layer";
import { classBreaks } from "@/lib/validations/layer";
import type {
  ColorItem,
  ColorMapItem,
  ColorScaleSelectorProps,
  ValueItem,
} from "@/types/map/color";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import React from "react";
import { v4 } from "uuid";

type OrdinalColorScaleProps = ColorScaleSelectorProps & {
  setIsClickAwayEnabled: (isClickAwayEnabled: boolean) => void;
  onCancel?: () => void;
};

const OrdinalColorScale = (props: OrdinalColorScaleProps) => {
  const theme = useTheme();
  const { colorSet, activeLayerField, activeLayerId } = props;
  const { t } = useTranslation("common");
  const [valueMaps, setValueMaps] = React.useState<ColorMapItem[]>(
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
  const [editingValues, setEditingValues] = React.useState<ValueItem | null>(
    null,
  );
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  function onInputHexChange(item: ColorItem) {
    const index = valueMaps.findIndex(
      (color: ColorMapItem) => color.id === item.id,
    );
    if (index !== -1) {
      const newColorMaps = [...valueMaps];
      newColorMaps[index] = {
        ...newColorMaps[index],
        color: item.color,
      };
      setValueMaps(newColorMaps);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const oldIndex = valueMaps.findIndex((color) => color.id === active.id);
    const newIndex = valueMaps.findIndex((color) => color.id === over?.id);
    const newOrderArray = arrayMove(valueMaps, oldIndex, newIndex);
    setValueMaps(newOrderArray);
  }

  function deleteStep(item: ColorItem) {
    if (valueMaps.length === 2) {
      return;
    }
    const index = valueMaps.findIndex((color) => color.id === item.id);
    if (index !== -1) {
      const newColorMaps = [...valueMaps];
      newColorMaps.splice(index, 1);
      setValueMaps(newColorMaps);
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
    const valueItem = {
      id: item.id,
      values: item.value,
    } as ValueItem;
    setEditingValues(valueItem);
    setAnchorEl(event.currentTarget);
  };

  const handleAddStep = () => {
    const newColorMaps = [...valueMaps];
    const lastColorMap = newColorMaps[newColorMaps.length - 1];
    newColorMaps.push({
      id: v4(),
      value: null,
      color: lastColorMap.color,
    });
    setValueMaps(newColorMaps);
  };

  const isValid = React.useMemo(() => {
    let isValid = true;
    valueMaps.forEach((item) => {
      if (!isValidHex(item.color)) {
        isValid = false;
      }
    });
    return isValid;
  }, [valueMaps]);

  const handleValueSelectorChange = (values: string[] | null) => {
    console.log(values);
    const updatedValues = [] as ColorMapItem[];
    valueMaps.forEach((value) => {
      if (value.id === editingValues?.id) {
        const updatedSelectedValue = {
          ...value,
          value: values,
        };
        updatedValues.push(updatedSelectedValue);
      } else {
        // check if the values are already in other valueMaps (not selected). If yes, remove it
        if (Array.isArray(value.value) && values?.length) {
          const updatedOtherValues = value.value.filter(
            (item) => !values.includes(item),
          );
          updatedValues.push({
            ...value,
            value: updatedOtherValues?.length ? updatedOtherValues : null,
          });
        } else {
          // already null
          updatedValues.push(value);
        }
      }
    });

    setValueMaps(updatedValues);
    editingValues && setEditingValues({ ...editingValues, values });
  };

  function onCancel() {
    props.onCancel && props.onCancel();
  }

  function onApply() {
    const colorMaps = [] as ColorMap;
    valueMaps.forEach((item) => {
      colorMaps.push([item.value, item.color]);
    });
    props.onCustomOrdinalApply && props.onCustomOrdinalApply(colorMaps);
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
          open={!!editingValues?.id}
          layerId={activeLayerId}
          selectedValues={editingValues.values}
          fieldName={activeLayerField?.name || ""}
          anchorEl={anchorEl}
          onSelectedValuesChange={handleValueSelectorChange}
          onDone={() => setEditingValues(null)}
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
          <SortableWrapper handleDragEnd={handleDragEnd} items={valueMaps}>
            {valueMaps?.map((item: ColorMapItem) => (
              <SortableItem
                active={
                  item.id === editingColorItem?.id ||
                  item.id === editingValues?.id
                }
                key={item.id}
                item={item}
                label={item.color}
                picker={
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
                    <IconButton onClick={() => deleteStep(item)}>
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
                    sx={{
                      ...(item.id === editingValues?.id && {
                        color: theme.palette.primary.main,
                      }),
                      transition: theme.transitions.create(
                        ["color", "transform"],
                        {
                          duration: theme.transitions.duration.standard,
                        },
                      ),
                      "&:hover": {
                        cursor: "pointer",
                        color: theme.palette.primary.main,
                      },
                    }}
                    tooltipProps={{
                      placement: "top",
                      arrow: true,
                      enterDelay: 200,
                    }}
                  >
                    <>
                      {item.value?.length ? item.value[0] : t("assign_values")}
                    </>
                  </OverflowTypograpy>
                  {item?.value?.length && item.value.length > 1 && (
                    <Tooltip
                      placement="top"
                      arrow
                      title={
                        <div style={{ whiteSpace: "pre-line" }}>
                          {item.value.slice(0, 4).join("\n")}
                          {item.value.length > 4 && "\n ..."}
                        </div>
                      }
                    >
                      <Chip
                        size="small"
                        sx={{ ml: 2 }}
                        label={`+${item.value.length - 1}`}
                      />
                    </Tooltip>
                  )}
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
              {t("common:add_step")}
            </Typography>
          </Button>
        </Box>
        <DropdownFooter
          isValid={isValid}
          onCancel={onCancel}
          onApply={onApply}
        />
      </Box>
    </>
  );
};

export default OrdinalColorScale;
