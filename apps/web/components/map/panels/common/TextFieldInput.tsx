import React, { useState } from "react";
import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  useTheme,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import FormLabelHelper from "@/components/common/FormLabelHelper";

type TextFieldInputProps = {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  tooltip?: string;
  onFocus?: () => void;
  type?: "text" | "number";
};

const TextFieldInput: React.FC<TextFieldInputProps> = ({
  value,
  onChange,
  label,
  disabled,
  tooltip,
  onFocus,
  type
}) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <FormControl size="small" fullWidth>
      {!!label && (
        <FormLabelHelper
          label={label}
          color={
            disabled
              ? theme.palette.secondary.main
              : focused
                ? theme.palette.primary.main
                : "inherit"
          }
          tooltip={tooltip}
        />
      )}

      <OutlinedInput
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => {
          setFocused(true);
          if (onFocus) onFocus();
        }}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        size="small"
        sx={{ pr: 0 }}
        inputProps={{
          type,
          style: {
            width: "100%",
            padding: "0px 15px 0px 12px",
            height: "40px",
          },
        }}
        endAdornment={
          !!value && (
            <InputAdornment position="end" sx={{mr: 2}}>
              <IconButton
                size="small"
                aria-label="clear input"
                onClick={() => onChange("")}
                edge="end"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }
      />
    </FormControl>
  );
};

export default TextFieldInput;
