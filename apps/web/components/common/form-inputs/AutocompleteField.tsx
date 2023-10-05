import * as React from "react";
import type { Control, Path, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

interface RhfAutocompleteFieldProps<
  O extends { value: string; label: string },
  TField extends FieldValues,
> {
  control: Control<TField>;
  name: Path<TField>;
  options: O[];
  label?: string;
  disabled?: boolean;
}

export const RhfAutocompleteField = <
  O extends { value: string; label: string },
  TField extends FieldValues,
>(
  props: RhfAutocompleteFieldProps<O, TField>,
) => {
  const { control, options, name } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: "this field is requried",
      }}
      render={({ field, fieldState: { error } }) => {
        const { onChange, value, ref } = field;
        return (
          <>
            <Autocomplete
              value={
                value
                ? options.find((option) => {
                  return value === option.value;
                }) ?? null
                : null
              }
              getOptionLabel={(option) => {
                return option.label;
              }}
              onChange={(_event: unknown, newValue) => {
                onChange(newValue ? newValue.value : null);
              }}
              id="controllable-autocomplete"
              options={options}
              renderInput={(params) => (
                <TextField
                  {...params}
                  disabled={props.disabled}
                  label={props.label}
                  inputRef={ref}
                  name={name}
                  size="medium"
                  helperText={error ? error.message : null}
                  error={!!error}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.value}>
                  <span>{option.label}</span>
                </li>
              )}
            />
          </>
        );
      }}
    />
  );
};
