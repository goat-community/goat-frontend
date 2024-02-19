import {
  FormControl,
  IconButton,
  InputAdornment,
  ListSubheader,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useMemo, useState } from "react";
import type { LayerFieldType } from "@/lib/validations/layer";
import FormLabelHelper from "@/components/common/FormLabelHelper";

export type SelectorProps = {
  selectedField: LayerFieldType | undefined;
  setSelectedField: (field: LayerFieldType | undefined) => void;
  fields: LayerFieldType[];
  label?: string;
  tooltip?: string;
  disabled?: boolean;
};

export const containsText = (text: string, searchText: string) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

export const FieldTypeColors = {
  string: [140, 210, 205],
  number: [248, 194, 28],
};

export const FieldTypeTag = styled("div")<{ fieldType: string }>(
  ({ fieldType }) => ({
    backgroundColor: `rgba(${FieldTypeColors[fieldType]}, 0.1)`,
    borderRadius: 4,
    border: `1px solid rgb(${FieldTypeColors[fieldType]})`,
    color: `rgb(${FieldTypeColors[fieldType]})`,
    display: "inline-block",
    fontSize: 10,
    fontWeight: "bold",
    padding: "0 5px",
    marginRight: "10px",
    textAlign: "center",
    width: "50px",
    lineHeight: "20px",
  }),
);

const LayerFieldSelector = (props: SelectorProps) => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const { selectedField, fields, setSelectedField } = props;
  const [focused, setFocused] = useState(false);
  const displayedfields = useMemo(() => {
    const filtered = fields.filter((field) => {
      return containsText(field.name, searchText);
    });
    return filtered;
  }, [fields, searchText]);
  return (
    <FormControl size="small" fullWidth>
      {props.label && (
        <FormLabelHelper
          label={props.label}
          color={
            props.disabled
              ? theme.palette.secondary.main
              : focused
              ? theme.palette.primary.main
              : "inherit"
          }
          tooltip={props.tooltip}
        />
      )}
      <Select
        fullWidth
        MenuProps={{
          autoFocus: false,
          sx: { width: "120px" },
          slotProps: {
            paper: {
              sx: {
                maxHeight: "350px",
                overflowY: "auto",
              },
            },
          },
        }}
        disabled={props.disabled}
        IconComponent={() => null}
        sx={{ pr: 1 }}
        displayEmpty
        value={selectedField ? JSON.stringify(selectedField) : ""}
        onChange={(e) => {
          const field = JSON.parse(e.target.value as string) as LayerFieldType;
          setSelectedField(field as LayerFieldType);
        }}
        onClose={() => {
          setFocused(false);
          setSearchText("");
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        startAdornment={
          <>
            {selectedField && FieldTypeColors[selectedField.type] && (
              <FieldTypeTag fieldType={selectedField.type}>
                {selectedField.type}
              </FieldTypeTag>
            )}
          </>
        }
        endAdornment={
          <IconButton
            size="small"
            sx={{ visibility: selectedField ? "visible" : "hidden" }}
            onClick={() => setSelectedField(undefined)}
          >
            <ClearIcon />
          </IconButton>
        }
        renderValue={() => {
          if (!selectedField)
            return <Typography variant="body2">Select a field</Typography>;
          return (
            <Typography variant="body2" fontWeight="bold">
              {selectedField.name}
            </Typography>
          );
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
        {displayedfields.map((field) => (
          <MenuItem
            sx={{ px: 2 }}
            key={field.name}
            value={JSON.stringify(field)}
          >
            {FieldTypeColors[field.type] && (
              <FieldTypeTag fieldType={field.type}>{field.type}</FieldTypeTag>
            )}
            <Typography variant="body2" fontWeight="bold">
              {field.name}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LayerFieldSelector;
