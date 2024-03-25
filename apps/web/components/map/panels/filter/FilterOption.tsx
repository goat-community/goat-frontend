import React from "react";
import TextInputSelect from "@/components/map/panels/filter/TextInputSelect";
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Box,
  useTheme,
} from "@mui/material";
import { useTranslation } from "@/i18n/client";
import { v4 } from "uuid";

import type { SelectChangeEvent } from "@mui/material";
import type { Option } from "@/components/map/panels/filter/TextInputSelect";

interface simpleInput {
  value: string | number | undefined;
  setChange: (value: string | number) => void;
  options: Option[];
  fetchMoreData: () => void;
}

export const NumberOption = (props: simpleInput) => {
  const { value, setChange, options, fetchMoreData } = props;

  return (
    <div style={{ marginBottom: "8px" }}>
      <TextInputSelect
        setInputValue={setChange}
        inputValue={value ? value : ""}
        options={options}
        type="number"
        fetchMoreData={fetchMoreData}
      />
    </div>
  );
};

export const TextOption = (props: simpleInput) => {
  const { value, setChange, options, fetchMoreData } = props;

  return (
    <div>
      <TextInputSelect
        setInputValue={setChange}
        inputValue={value ? value : ""}
        options={options}
        fetchMoreData={fetchMoreData}
      />
    </div>
  );
};

interface SelectOptionProps {
  value: string[] | undefined;
  setChange: (value: string[]) => void;
  options: Option[];
  fetchMoreData: () => void;
}

export const SelectOption = (props: SelectOptionProps) => {
  const { value, setChange, options, fetchMoreData } = props;

  const { t } = useTranslation("common");

  let debounceTimer;

  const onScrolling = (e) => {
    if (e.target) {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight;

      if (isNearBottom && fetchMoreData) {
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
          fetchMoreData();
        }, 500);
      }
    }
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel>{t("select_value")}</InputLabel>
        <Select
          MenuProps={{
            PaperProps: {
              onScroll: onScrolling,
            },
          }}
          multiple
          value={value as unknown as string}
          label={t("select_value")}
          onChange={(event: SelectChangeEvent) =>
            setChange(event.target.value as unknown as string[])
          }
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
  options: Option[];
  fetchMoreData: () => void;
}

export const DualNumberOption = (props: DualNumberOptionProps) => {
  const { setChange1, value1, setChange2, value2, fetchMoreData, options } =
    props;

  const theme = useTheme();

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: theme.spacing(3) }}
    >
      <TextInputSelect
        setInputValue={setChange1}
        inputValue={value1 ? value1 : ""}
        options={options}
        type="number"
        fetchMoreData={fetchMoreData}
      />
      <TextInputSelect
        setInputValue={setChange2}
        inputValue={value2 ? value2 : ""}
        options={options}
        type="number"
        fetchMoreData={fetchMoreData}
      />
    </Box>
  );
};
