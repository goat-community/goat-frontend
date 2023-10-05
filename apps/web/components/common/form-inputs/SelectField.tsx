import * as React from "react";
import type { Control, Path, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import MenuItem from "@mui/material/MenuItem";
import { TextField } from "@mui/material";

interface RhfSelectFieldProps<
  O extends { value: string; label: string },
  TField extends FieldValues,
> {
  control: Control<TField>;
  name: Path<TField>;
  options: O[];
  label?: string;
}

export const RhfSelectField = <
  O extends { value: string; label: string },
  TField extends FieldValues,
>(
  props: RhfSelectFieldProps<O, TField>,
) => {
  const { control, options, name } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: "this field is required",
      }}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value, ref } = field;
        return (
          <TextField
            select
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            inputRef={ref}
            name={name}
            size="medium"
            error={!!error}
            label={props.label}
            helperText={error?.message}
            SelectProps={{
              MenuProps: {
                sx: { maxHeight: "350px" },
              },
            }}
          >
            {options.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{ height: "32px" }}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );
      }}
    />
  );
};
