import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { styled } from "@mui/material/styles";
import CustomColorPicker from "@/components/map/panels/style/color/CustomColorPicker";
import PresetColorPicker from "@/components/map/panels/style/color/PresetColorPicker";
import type { SingleColorSelectorProps } from "@/types/map/color";

enum SingleColorType {
  Picker = "picker",
  Preset = "preset",
}

const CustomStyledSingleColorSelector = styled("div")(({ theme }) => ({
    paddingLeft: `${theme.spacing(3)}`,
    paddingRight: `${theme.spacing(3)}`,
  ".side-panel-section-group": {
    marginBottom: `${theme.spacing(3)}`,
  },
  ".color-box": {
    position: "relative",
    borderRadius: "4px",
  },
}));

const SingleColorSelector = (props: SingleColorSelectorProps) => {
  const containerRef = useRef(null);
  const [colorSelectionType, setColorSelectionType] = useState(
    SingleColorType.Picker,
  );
  const isPickerSelected = colorSelectionType === SingleColorType.Picker;

  const handleSelectionTypeChange = () => {
    setColorSelectionType(
      colorSelectionType === SingleColorType.Picker
        ? SingleColorType.Preset
        : SingleColorType.Picker,
    );
  };

  useEffect(() => {
    if (containerRef?.current) {
      const el: Element = containerRef.current;
      el.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [containerRef]);

  return (
    <CustomStyledSingleColorSelector ref={containerRef}>
      <ToggleButtonGroup
        fullWidth
        color="primary"
        size="small"
        exclusive
        value={colorSelectionType}
        onChange={handleSelectionTypeChange}
      >
        <ToggleButton
          value={SingleColorType.Picker}
          aria-labelledby="Color picker button"
        >
          <Typography variant="caption" color="inherit">
            Color Picker
          </Typography>
        </ToggleButton>
        <ToggleButton
          value={SingleColorType.Preset}
          aria-labelledby="Preset colors button"
        >
          <Typography variant="caption" color="inherit">
            Preset Colors{" "}
          </Typography>
        </ToggleButton>
      </ToggleButtonGroup>

      <Box className="color-box" style={{ backgroundColor: "transparent" }}>
        {isPickerSelected ? (
          <CustomColorPicker {...props} />
        ) : (
          <Box mt={1}>
            <PresetColorPicker {...props} />
          </Box>
        )}
      </Box>
    </CustomStyledSingleColorSelector>
  );
};

export default SingleColorSelector;
