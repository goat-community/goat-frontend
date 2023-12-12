import { hexToRgb, isValidHex, isValidRGB } from "@/lib/utils/helpers";
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

function ColorPicker({
  selectedColor,
  onChange,
}: {
  selectedColor: string;
  onChange: (color: number[]) => void;
}) {
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
    if (onChange) {
      onChange(rgbColor);
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
      onChange([newRgb.r, newRgb.g, newRgb.b]);
    }
  };

  const handleHexInputChange = (e) => {
    const value = e.target.value;
    setInputHex(value);
    if (isValidHex(`#${value}`)) {
      const rgbColor = hexToRgb(`#${value}`);
      setInputRgb({ r: rgbColor[0], g: rgbColor[1], b: rgbColor[2] });
      onChange(rgbColor);
    }
  };

  return (
    <Box
      sx={{
        marginTop: theme.spacing(1.5),
        "& .react-colorful": {
          width: "100%",
        },
        "& .react-colorful__saturation": {
          borderRadius: "2px",
        },
        "& .react-colorful__last-control": {
          borderRadius: "2px",
          height: "8px",
          marginTop: "12px",
          width: "calc(100% - 40px)",
          marginBottom: "6px",
        },
        "& .react-colorful__pointer": {
          height: theme.spacing(1.5),
          width: theme.spacing(1.5),
        },
      }}
    >
      <Box style={{ position: "relative" }}>
        <HexColorPicker
          color={selectedColor?.length === 7 ? selectedColor : "#ffffff"}
          onChange={handleColorPickerChange}
        />
        <Box style={{ backgroundColor: selectedColor }} />
      </Box>
      <Box mt={1} mb={1}>
        <Divider />
      </Box>
      <Grid container spacing={1}>
        <Grid item xs={5} style={{ paddingRight: theme.spacing(1) }}>
          <TextField
            size="small"
            type="text"
            inputProps={{
              role: "input",
              "aria-label": "Layer color Hex input",
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
                paddingRight: theme.spacing(1),
              },
            }}
            onChange={(e) => handleHexInputChange(e)}
            value={inputHex}
            label="Hex"
            data-testid="HexInput"
          />
        </Grid>
        <Grid item xs={7}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <TextField
                size="small"
                type="text"
                inputProps={{
                  role: "input",
                  "aria-label": "Layer color RGB R input",
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

export default ColorPicker;
