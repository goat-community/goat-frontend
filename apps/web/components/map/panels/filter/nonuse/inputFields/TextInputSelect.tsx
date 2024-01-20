import React, { useRef, useState } from "react";
import {
  MenuItem,
  Select,
  InputBase,
  TextField,
  useTheme,
  ListSubheader,
  InputAdornment,
  Box,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { v4 } from "uuid";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { filterSearch } from "@/lib/utils/helpers";

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
  fetchMoreData: () => void;
}

const TextInputSelect = (props: TextInputSelectProps) => {
  const {
    inputValue,
    setInputValue,
    options,
    type = "text",
    fetchMoreData,
  } = props;
  const [searchText, setSearchText] = useState("");
  const input = useRef<HTMLInputElement | null>(null);

  const theme = useTheme();

  const mapLoading = false;

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
          p: 2,
          pt: 3,
          pl: 3,
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
        variant="standard"
        InputProps={{
          disableUnderline: true,
        }}
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
              PaperProps: {
                onScroll: onScrolling,
              },
              classes: {
                paper: "selectTextInput",
              },
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "right",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "right",
              },
              autoFocus: false,
              sx: { width: "294.5px", marginTop: 3 },
              slotProps: {
                paper: {
                  sx: {
                    maxHeight: "350px",
                    overflowY: "auto",
                  },
                },
              },
            }}
          >
            <ListSubheader sx={{ px: 2, pt: 1 }}>
              <TextField
                size="small"
                autoFocus
                placeholder="Search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Escape") {
                    e.stopPropagation();
                  }
                }}
              />
            </ListSubheader>
            {filterSearch(options, "label", searchText).length ? (
              filterSearch(options, "label", searchText).map((option) => (
                <MenuItem
                  key={v4()}
                  value={option.value}
                  sx={{ width: "262.5px" }}
                >
                  {option.label}
                </MenuItem>
              ))
            ) : (
              <Typography
                variant="body1"
                sx={{ width: "262.5px", px: 2, py: 1, textAlign: "center" }}
              >
                No Result.
              </Typography>
            )}
          </Select>
        ) : null}
      </Box>
    </Box>
  );
};

export default TextInputSelect;
