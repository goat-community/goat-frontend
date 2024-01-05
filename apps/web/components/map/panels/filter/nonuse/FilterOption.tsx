import React from "react";
import TextInputSelect from "./inputFields/TextInputSelect";
import { dummyFilterDataNumber } from "@/public/assets/data/filterDummy";
import { Select, FormControl, InputLabel, MenuItem } from "@mui/material";
import { useTranslation } from "@/i18n/client";
import { v4 } from "uuid";

import type { SelectChangeEvent } from "@mui/material";
import type { Option } from "./inputFields/TextInputSelect";

interface simpleInput {
  value: string | number | undefined;
  setChange: (value: string | number) => void;
  options: Option[];
}

export const NumberOption = (props: simpleInput) => {
  const { value, setChange, options } = props;

  return (
    <div style={{ marginBottom: "8px" }}>
      <TextInputSelect
        setInputValue={setChange}
        inputValue={value ? value : ""}
        options={options}
        type="number"
      />
    </div>
  );
};

export const TextOption = (props: simpleInput) => {
  const { value, setChange, options } = props;

  return (
    <div>
      <TextInputSelect
        setInputValue={setChange}
        inputValue={value ? value : ""}
        options={options}
      />
    </div>
  );
};

interface SelectOptionProps {
  value: string[] | undefined;
  setChange: (value: string[]) => void;
  options: Option[];
}

export const SelectOption = (props: SelectOptionProps) => {
  const { value, setChange, options } = props;

  const { t } = useTranslation("maps");

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          {t("panels.filter.select_value")}
        </InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={value as unknown as string}
          label={t("panels.filter.select_value")}
          onChange={(event: SelectChangeEvent) => setChange(event.target.value as unknown as string[])}
        >
          {options.map((option) => (
            <MenuItem key={v4()} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

interface DualNumberOptionProps {
  value1: string | undefined;
  setChange1: (value: string) => void;
  value2: string | undefined;
  setChange2: (value: string) => void;
}

export const DualNumberOption = (props: DualNumberOptionProps) => {
  const { setChange1, value1, setChange2, value2 } = props;

  return (
    <div>
      <TextInputSelect
        setInputValue={setChange1}
        inputValue={value1 ? value1 : ""}
        options={dummyFilterDataNumber}
        type="number"
      />
      <TextInputSelect
        setInputValue={setChange2}
        inputValue={value2 ? value2 : ""}
        options={dummyFilterDataNumber}
        type="number"
      />
    </div>
  );
};
