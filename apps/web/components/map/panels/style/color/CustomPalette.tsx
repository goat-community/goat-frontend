// Copyright (c) 2023 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import ColorPalette from "@/components/map/panels/style/color/ColorPalette";
import type { ColorRange } from "@/lib/validations/layer";
import { DragIndicator } from "@mui/icons-material";
import {
  Box,
  Button,
  Fade,
  Grid,
  IconButton,
  MenuItem,
  Popper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { DragHandle } from "@/components/common/DragHandle";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { CSS } from "@dnd-kit/utilities";

import React, { useMemo, useState } from "react";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { v4 } from "uuid";
import { useTranslation } from "@/i18n/client";
import { isValidHex, rgbToHex } from "@/lib/utils/helpers";
import SingleColorSelector from "@/components/map/panels/style/color/SingleColorSelector";

type CustomPaletteProps = {
  customPalette: ColorRange;
  onApply: (palette: ColorRange) => void;
  onCancel: () => void;
};

type ColorItem = {
  id: string;
  color: string;
};

type SortableItemProps = {
  item: ColorItem;
  active?: boolean;
  label: string;
  onDelete?: (item: ColorItem) => void;
  onAdd?: (item: ColorItem) => void;
  onChange?: (item: ColorItem) => void;
  onClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: ColorItem,
  ) => void;
};

export function SortableItem(props: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.item.id });
  const theme = useTheme();
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: `${transition}, border-color 0.2s ease-in-out`,
  };
  return (
    <MenuItem
      key={props.item.id}
      ref={setNodeRef}
      selected={props.active}
      style={style}
      disableGutters
      disableRipple
      sx={{
        pr: 2,
        py: 1,
        ":hover": {
          "& div, & button": {
            opacity: 1,
          },
        },
      }}
    >
      <Grid container alignItems="center" justifyContent="start" spacing={2}>
        <Grid item xs={1} sx={{ mx: 1 }}>
          <DragHandle {...attributes} listeners={listeners}>
            <DragIndicator fontSize="small" />
          </DragHandle>
        </Grid>
        <Grid item xs={2} zeroMinWidth>
          <Box
            onClick={(e) => {
              e.stopPropagation();
              props.onClick && props.onClick(e, props.item);
            }}
            sx={{
              height: "20px",
              width: "32px",
              borderRadius: "4px",
              backgroundColor: props.item.color,
              "&:hover": {
                cursor: "pointer",
              },
            }}
          />
        </Grid>
        <Grid item xs={6} zeroMinWidth>
          <TextField
            InputProps={{ sx: { height: "32px", ml: 2 } }}
            sx={{
              "& .MuiOutlinedInput-input": {
                padding: `0 ${theme.spacing(2)}`,
              },
            }}
            onChange={(e) => {
              props.onChange &&
                props.onChange({
                  ...props.item,
                  color: e.target.value.toUpperCase(),
                });
            }}
            variant="outlined"
            value={props.item.color}
          />
        </Grid>
        <Grid item xs={2}>
          <Stack direction="row">
            <IconButton
              size="small"
              onClick={() => props.onAdd && props.onAdd(props.item)}
            >
              <Icon
                iconName={ICON_NAME.PLUS}
                style={{
                  fontSize: 12,
                }}
                htmlColor="inherit"
              />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => props.onDelete && props.onDelete(props.item)}
            >
              <Icon
                iconName={ICON_NAME.TRASH}
                style={{
                  fontSize: 12,
                }}
                htmlColor="inherit"
              />
            </IconButton>
          </Stack>
        </Grid>
      </Grid>
    </MenuItem>
  );
}

export function SingleColorPopper(props: {
  editingItem: ColorItem | null;
  anchorEl: HTMLDivElement | null;
  onInputHexChange: (item: ColorItem) => void;
}) {
  return (
    <Popper
      open={props.editingItem !== null}
      anchorEl={props.anchorEl}
      transition
      sx={{ zIndex: 1200 }}
      placement="left"
      disablePortal
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 75],
          },
        },
      ]}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          <Box sx={{ py: 3, bgcolor: "background.paper", borderRadius: 1 }}>
            {props.editingItem && (
              <SingleColorSelector
                selectedColor={props.editingItem?.color || "#000000"}
                onSelectColor={(color) => {
                  if (props.editingItem)
                    props.onInputHexChange({
                      ...props.editingItem,
                      color: rgbToHex(color),
                    });
                }}
              />
            )}
          </Box>
        </Fade>
      )}
    </Popper>
  );
}

const CustomPalette = ({
  customPalette,
  onApply,
  onCancel,
}: CustomPaletteProps) => {
  const { t } = useTranslation(["common"]);

  const [colors, setColors] = useState(
    customPalette.colors.map((color) => {
      return {
        id: v4(),
        color: color,
      };
    }) || [],
  );

  const areColorsValid = useMemo(() => {
    let isValid = true;
    colors.forEach((color) => {
      if (!isValidHex(color.color)) {
        isValid = false;
      }
    });
    return isValid;
  }, [colors]);

  async function handleDragEnd(event) {
    const { active, over } = event;
    const oldIndex = colors.findIndex((color) => color.id === active.id);
    const newIndex = colors.findIndex((color) => color.id === over.id);
    const newOrderArray = arrayMove(colors, oldIndex, newIndex);
    setColors(newOrderArray);
  }

  async function deleteColor(item: ColorItem) {
    if (colors.length === 2) {
      return;
    }
    const index = colors.findIndex((color) => color.id === item.id);
    if (index !== -1) {
      const newColors = colors.toSpliced(index, 1);
      setColors(newColors);
    }
  }

  async function duplicateColor(item: ColorItem) {
    const index = colors.findIndex((color) => color.id === item.id);
    if (index !== -1) {
      const newColors = colors.toSpliced(index + 1, 0, {
        id: v4(),
        color: item.color,
      });
      setColors(newColors);
    }
  }

  function _onCancel() {
    onCancel();
  }

  function _onApply() {
    const newColorRange = {
      ...customPalette,
      type: "custom",
      colors: colors.map((color) => color.color),
    };
    onApply(newColorRange);
  }

  function _onInputHexChange(item: ColorItem) {
    const index = colors.findIndex((color) => color.id === item.id);
    if (index !== -1) {
      const newColors = colors.toSpliced(index, 1, {
        ...item,
      });
      setColors(newColors);
    }
  }

  const [editingItem, setEditingItem] = React.useState<ColorItem | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleColorPicker = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: ColorItem,
  ) => {
    setEditingItem(item);
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <SingleColorPopper
        editingItem={editingItem}
        anchorEl={anchorEl}
        onInputHexChange={_onInputHexChange}
      />

      <Box sx={{ px: 2 }}>
        <ColorPalette colors={colors.map((color) => color.color)} />
      </Box>
      <Box
        onClick={() => setEditingItem(null)}
        sx={{ maxHeight: "240px", overflowY: "auto" }}
      >
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          autoScroll={false}
        >
          <SortableContext
            items={colors}
            strategy={verticalListSortingStrategy}
          >
            {colors?.map((item) => (
              <SortableItem
                active={item.id === editingItem?.id}
                key={item.id}
                item={item}
                label={item.color}
                onAdd={duplicateColor}
                onDelete={deleteColor}
                onChange={_onInputHexChange}
                onClick={handleColorPicker}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Box>
      <Box sx={{ px: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{ px: 2 }}
          spacing={1}
        >
          <Button
            variant="text"
            size="small"
            sx={{ borderRadius: 0 }}
            onClick={_onCancel}
          >
            <Typography variant="body2" fontWeight="bold">
              {t("common:cancel")}
            </Typography>
          </Button>
          <Button
            variant="text"
            size="small"
            color="primary"
            disabled={!areColorsValid}
            sx={{ borderRadius: 0 }}
            onClick={_onApply}
          >
            <Typography variant="body2" fontWeight="bold" color="inherit">
              {t("common:apply")}
            </Typography>
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default CustomPalette;
