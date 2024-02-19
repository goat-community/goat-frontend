import {
  Checkbox,
  InputAdornment,
  ListSubheader,
  MenuItem,
  Stack,
  TextField,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useMemo, useState } from "react";
import FormLabelHelper from "@/components/common/FormLabelHelper";
import CustomMenu from "@/components/common/CustomMenu";

import { Icon, type ICON_NAME } from "@p4b/ui/components/Icon";
import type { SelectorItem } from "@/types/map/common";

type SelectorProps = {
  selectedItems: SelectorItem[] | SelectorItem | undefined;
  setSelectedItems: (items: SelectorItem[] | SelectorItem | undefined) => void;
  items: SelectorItem[];
  multiple?: boolean;
  tooltip?: string;
  placeholder?: string;
  enableSearch?: boolean;
  label?: string;
  allSelectedLabel?: string;
  errorMessage?: string;
  emptyMessage?: string;
  emptyMessageIcon?: ICON_NAME;
  onScrolling?: (e) => void;
};

const containsText = (text: string, searchText: string) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

const SelectionWithInput = (props: SelectorProps) => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const {
    selectedItems,
    items,
    setSelectedItems,
    enableSearch,
    label,
    tooltip,
    multiple,
    emptyMessage,
    emptyMessageIcon,
    onScrolling,
  } = props;
  const [openedMenu, setOpenedMenu] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const displayedItems = useMemo(() => {
    if (!enableSearch) return items;
    const filtered = items.filter((item) => {
      return containsText(item.label, searchText);
    });
    return filtered;
  }, [enableSearch, items, searchText]);

  const selectedValue = useMemo(() => {
    if (!multiple && !Array.isArray(selectedItems)) {
      return selectedItems ? selectedItems.value : "";
    } else {
      return selectedItems && Array.isArray(selectedItems)
        ? selectedItems?.map((item) => item.value)
        : [];
    }
  }, [multiple, selectedItems]);

  return (
    <Box position="relative">
      {label && (
        <FormLabelHelper
          label={label}
          color={theme.palette.primary.main}
          tooltip={tooltip}
        />
      )}
      <TextField
        fullWidth
        size="small"
        onClick={() => setOpenedMenu(true)}
        defaultValue=""
        value={inputValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setSelectedItems({
            value: event.target.value,
            label: event.target.value,
          });
          setInputValue(event.target.value);
        }}
      />
      {openedMenu ? (
        <CustomMenu
          onScrolling={onScrolling}
          close={() => setOpenedMenu(false)}
          sx={{ right: "0", width: "100%", top: "105%" }}
        >
          {enableSearch && (
            <ListSubheader sx={{ px: 2, pt: 1 }}>
              <TextField
                size="small"
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
          )}
          {emptyMessage && emptyMessageIcon && displayedItems.length === 0 && (
            <Stack
              direction="column"
              spacing={2}
              sx={{
                my: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {emptyMessageIcon && (
                <Icon
                  iconName={emptyMessageIcon}
                  fontSize="small"
                  htmlColor={theme.palette.text.secondary}
                />
              )}
              {emptyMessage && (
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color={theme.palette.text.secondary}
                >
                  {emptyMessage}
                </Typography>
              )}
            </Stack>
          )}

          {displayedItems.map((item) => (
            <MenuItem
              sx={{ px: 2, py: 2 }}
              key={item.value}
              value={item.value}
              onClick={() => {
                setSelectedItems(item);
                setInputValue(item.value.toString());
              }}
            >
              {multiple && Array.isArray(selectedValue) && (
                <Checkbox
                  sx={{ mr: 2, p: 0 }}
                  size="small"
                  checked={
                    selectedValue?.findIndex(
                      (selected) => selected === item.value,
                    ) > -1
                  }
                />
              )}
              {item.icon && (
                <Icon
                  iconName={item.icon}
                  style={{
                    fontSize: "14px",
                    color: theme.palette.text.secondary,
                  }}
                  sx={{ mr: 2 }}
                  color="inherit"
                />
              )}
              <Typography
                variant="body2"
                fontWeight="bold"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </Typography>
            </MenuItem>
          ))}
        </CustomMenu>
      ) : null}
    </Box>
  );
};

export default SelectionWithInput;
