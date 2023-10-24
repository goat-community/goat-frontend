import React, { useRef } from "react";
import {
  MenuItem,
  Select,
  InputBase,
  TextField,
  useTheme,
  Box,
} from "@mui/material";
import { v4 } from "uuid";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useSelector } from "react-redux";

import type { IStore } from "@/types/store";

export type Option = {
  label: string;
  value: string;
} & {
  [key: string]: string | number | boolean;
};

interface TextInputSelectProps {
  setInputValue: (value: string | number) => void;
  inputValue: string | number;
  options: Option[];
  type?: "number" | "text";
}

const TextInputSelect = (props: TextInputSelectProps) => {
  const { inputValue, setInputValue, options, type = "text" } = props;
  const input = useRef<HTMLInputElement | null>(null);

  const theme = useTheme();

  const { loading: mapLoading } = useSelector((state: IStore) => state.map);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSelectChange = (event) => {
    setInputValue(event.target.value);
  };

  const increaseNumber = () => {
    if (input.current) {
      input.current.stepUp();
      setInputValue(input.current.value);
    }
  };

  const decreaseNumber = () => {
    if (input.current) {
      input.current.stepDown();
      setInputValue(input.current.value);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        border: `1px solid ${theme.palette.secondary.main}`,
        borderRadius: "4px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <TextField
        sx={{
          flex: 9,
          "& .mui-9425fu-MuiOutlinedInput-notchedOutline": {
            outline: "none",
            border: "none",
          },
        }}
        size="small"
        disabled={mapLoading}
        inputRef={input}
        value={inputValue}
        onChange={handleInputChange}
        type={type}
      />
      {type === "number" ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 8px",
            borderLeft: `1px solid ${theme.palette.secondary.main}`,
          }}
        >
          <Icon
            iconName={ICON_NAME.STEPUP}
            viewBox="0 0 10 5"
            htmlColor={theme.palette.text.primary}
            style={{ height: "13px", cursor: "pointer" }}
            onClick={increaseNumber}
          />
          <Icon
            iconName={ICON_NAME.STEPDOWN}
            viewBox="0 0 45 24"
            htmlColor={theme.palette.text.primary}
            style={{ height: "13px", cursor: "pointer" }}
            onClick={decreaseNumber}
          />
        </Box>
      ) : null}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: "7px",
          borderLeft: `1px solid ${theme.palette.secondary.main}`,
        }}
      >
        {options ? (
          <Select
            size="small"
            value=""
            disabled={mapLoading}
            onChange={handleSelectChange}
            input={<InputBase />}
            sx={{
              "& .mui-bd3j14-MuiPaper-root-MuiPopover-paper-MuiMenu-paper": {
                position: "absolute",
                width: "265px",
                marginTop: "6px",
                zIndex: 1000,
              },
              "& .mui-1c8tfof-MuiButtonBase-root-MuiMenuItem-root": {
                position: "absolute",
                width: "265px",
                marginTop: "6px",
                zIndex: 1000,
              },
              "&.mui-6hp17o-MuiList-root-MuiMenu-list": {
                position: "absolute",
                width: "265px",
                marginTop: "6px",
                zIndex: 1000,
              },
            }}
            MenuProps={{
              classes: {
                paper: "selectTextInput",
                // paper: classes.selectDropdown,
              },
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "right",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "right",
              },
            }}
          >
            {options.map((option) => (
              <MenuItem key={v4()} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        ) : null}
      </Box>
    </Box>
  );
};

export default TextInputSelect;