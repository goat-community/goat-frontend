// Copyright (c) 2023 Uber Technologies, Inc; Plan4Better GmbH
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

import { hexToRgb, isValidHex, isValidRGB } from "@/lib/utils/helpers";
import type { SingleColorSelectorProps } from "@/types/map/color";
import {
  Box,
  debounce,
  Divider,
  Grid,
  InputAdornment,
  rgbToHex,
  TextField,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";

function CustomColorPicker({
  selectedColor,
  onSelectColor,
}: SingleColorSelectorProps) {
  const theme = useTheme();
  const rgbColor = hexToRgb(selectedColor);
  const [inputHex, setInputHex] = useState(selectedColor.substring(1));
  const [inputRgb, setInputRgb] = useState({
    r: rgbColor[0],
    g: rgbColor[1],
    b: rgbColor[2],
  });

  const handleColorPickerChangeDebounced = debounce((color: string) => {
    setInputHex(color.substring(1));
    const rgbColor = hexToRgb(color);
    setInputRgb({ r: rgbColor[0], g: rgbColor[1], b: rgbColor[2] });
    if (onSelectColor) {
      onSelectColor(rgbColor, undefined);
    }
  }, 100);

  const handleColorPickerChange = (color) => {
    handleColorPickerChangeDebounced(color);
  };

  const handleRgbInputChange = (e, which) => {
    const value = e.target.value || 0;
    let newRgb;
    if (isNaN(value) || parseInt(value) < 0 || parseInt(value) > 255) {
      return;
    }
    if (which === "r") {
      newRgb = { ...inputRgb, r: parseInt(value) };
    } else if (which === "g") {
      newRgb = { ...inputRgb, g: parseInt(value) };
    } else if (which === "b") {
      newRgb = { ...inputRgb, b: parseInt(value) };
    }
    setInputRgb(newRgb);
    if (isValidRGB(newRgb)) {
      const hexColor = rgbToHex(`rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`);
      setInputHex(hexColor.substring(1));
      onSelectColor([newRgb.r, newRgb.g, newRgb.b]);
    }
  };

  const handleHexInputChange = (e) => {
    const value = e.target.value;
    setInputHex(value);
    if (isValidHex(`#${value}`)) {
      const rgbColor = hexToRgb(`#${value}`);
      setInputRgb({ r: rgbColor[0], g: rgbColor[1], b: rgbColor[2] });
      onSelectColor(rgbColor);
    }
  };

  return (
    <Box
      sx={{
        marginTop: theme.spacing(1),
        "& .react-colorful": {
          width: "100%",
        },
        "& .react-colorful__saturation": {
          borderRadius: "0px",
        },
        "& .react-colorful__last-control": {
          borderRadius: "4px",
          height: "8px",
          marginTop: "12px",
          width: "calc(100% - 40px)",
          marginBottom: "5px",
        },
        "& .react-colorful__pointer": {
          height: theme.spacing(3),
          width: theme.spacing(3),
        },
      }}
    >
      <Box style={{ position: "relative" }}>
        <HexColorPicker
          color={selectedColor?.length === 7 ? selectedColor : "#ffffff"}
          onChange={handleColorPickerChange}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "2px",
            right: "4px",
            width: theme.spacing(6),
            height: theme.spacing(3),
            borderRadius: theme.spacing(0.5),
          }}
          style={{ backgroundColor: selectedColor }}
        />
      </Box>
      <Box mt={1} mb={1}>
        <Divider />
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={4} style={{ paddingRight: theme.spacing(1) }}>
          <TextField
            size="small"
            type="text"
            inputProps={{
              role: "input",
              "aria-label": "Layer color Hex input",
              style: { paddingRight: 2 },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  style={{ marginRight: theme.spacing(0.5) }}
                >
                  #
                </InputAdornment>
              ),
              style: {
                paddingLeft: theme.spacing(0.75),
                paddingRight: theme.spacing(0),
                fontSize: "0.75rem",
              },
            }}
            onChange={(e) => handleHexInputChange(e)}
            value={inputHex}
            label="Hex"
            data-testid="HexInput"
          />
        </Grid>
        <Grid item xs={8}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <TextField
                size="small"
                type="text"
                inputProps={{
                  role: "input",
                  "aria-label": "Layer color RGB R input",
                  style: { paddingLeft: 10, paddingRight: 2 },
                }}
                InputProps={{
                  style: {
                    fontSize: "0.75rem",
                  },
                }}
                onChange={(e) => handleRgbInputChange(e, "r")}
                value={inputRgb.r}
                label="R"
                data-testid="RInput"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                size="small"
                type="text"
                inputProps={{
                  role: "input",
                  "aria-label": "Layer color RGB G input",
                  style: { paddingLeft: 10, paddingRight: 2 },
                }}
                InputProps={{
                  style: {
                    fontSize: "0.75rem",
                  },
                }}
                onChange={(e) => handleRgbInputChange(e, "g")}
                value={inputRgb.g}
                label="G"
                data-testid="GInput"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                size="small"
                type="text"
                inputProps={{
                  role: "input",
                  "aria-label": "Layer color RGB B input",
                  style: { paddingLeft: 10, paddingRight: 2 },
                }}
                InputProps={{
                  style: {
                    fontSize: "0.75rem",
                  },
                }}
                onChange={(e) => handleRgbInputChange(e, "b")}
                value={inputRgb.b}
                label="B"
                data-testid="BInput"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CustomColorPicker;
