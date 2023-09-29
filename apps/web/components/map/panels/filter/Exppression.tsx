import React, { useState } from "react";
import { comparerModes } from "@/public/assets/data/comparers_filter";

import FilterOptionField from "./FilterOptionField";
import { ICON_NAME } from "@p4b/ui/components/Icon";
import { Icon } from "@p4b/ui/components/Icon";
import { v4 } from "uuid";
import {
  Button,
  MenuList,
  MenuItem,
  Box,
  useTheme,
  Typography,
  Select,
  Chip,
  FormControl,
  InputLabel,
} from "@mui/material";
import type { Expression } from "@/types/map/filtering";
import { useDispatch } from "react-redux";
import { addExpression, removeFilter } from "@/lib/store/mapFilters/slice";
import type { LayerPropsMode } from "@/types/map/filtering";
import type { SelectChangeEvent } from "@mui/material";

import CustomMenu from "@/components/common/CustomMenu";

interface ExpressionProps {
  isLast: boolean;
  expression: Expression;
  logicalOperator: string;
  deleteOneExpression: (value: string) => void;
  duplicateExpression: (value: string) => void;
  id: string;
  keys: LayerPropsMode[];
}

const Exppression = (props: ExpressionProps) => {
  const { isLast, expression, logicalOperator, id, keys, deleteOneExpression, duplicateExpression } =
    props;
  const [attributeSelected, setAttributeSelected] = useState<string | string[]>(
    expression.attribute ? expression.attribute.name : "",
  );
  const [comparerSelected, setComparerSelected] = useState<string | string[]>(
    expression.expression ? expression.expression.value : "",
  );
  const [anchorEl, setAnchorEl] = React.useState<boolean>(false);

  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const theme = useTheme();

  function getFeatureAttribute(type: string | string[]) {
    const valueToFilter = keys.filter((key) => key.name === type);
    if (valueToFilter.length && valueToFilter[0].type === "string") {
      return "text";
    }
    return valueToFilter[0].type;
  }

  function handleAttributeSelect(event: SelectChangeEvent<string>) {
    const newExpression = { ...expression };
    newExpression.attribute = {
      type: getFeatureAttribute(event.target.value),
      name: event.target.value,
    };
    setAttributeSelected(event.target.value);
    dispatch(addExpression(newExpression));
  }

  function handleComparerSelect(event: SelectChangeEvent<string>) {
    const newExpression = { ...expression };
    newExpression.expression = getComparer(event.target.value)[0];
    newExpression.firstInput = "";
    newExpression.secondInput = "";
    setComparerSelected(event.target.value);
    dispatch(addExpression(newExpression));
    dispatch(removeFilter(newExpression.id));
  }

  function getComparer(type: string | string[]) {
    return comparerModes[getFeatureAttribute(attributeSelected)].filter(
      (compAttribute) => type === compAttribute.value,
    );
  }

  function toggleMorePopover() {
    setAnchorEl(!anchorEl);
  }

  return (
    <>
      <Box key={v4()}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: theme.spacing(4),
            padding: "9.5px 0",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: "600",
            }}
          >
            Expression
          </Typography>
          <Box sx={{ position: "relative" }}>
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={toggleMorePopover}
              variant="text"
            >
              <Icon iconName={ICON_NAME.ELLIPSIS} />
            </Button>
            {open ? (
              <CustomMenu close={toggleMorePopover}>
                <MenuList>
                  <MenuItem onClick={() => deleteOneExpression(expression.id)}>
                    Delete Expression
                  </MenuItem>
                  <MenuItem onClick={() => duplicateExpression(expression.id)}>Duplicate</MenuItem>
                </MenuList>
              </CustomMenu>
            ) : null}
          </Box>
        </Box>
        <FormControl
          fullWidth
          size="small"
          sx={{
            margin: `${theme.spacing(1)} 0`,
          }}
        >
          <InputLabel id="demo-simple-select-label">
            Select attribute
          </InputLabel>
          <Select
            label="Select attribute"
            defaultValue={attributeSelected ? attributeSelected : ""}
            onChange={handleAttributeSelect}
          >
            {keys.map((key) => (
              <MenuItem key={v4()} value={key.name}>
                {key.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          size="small"
          fullWidth
          sx={{
            margin: `${theme.spacing(1)} 0`,
          }}
        >
          <InputLabel id="demo-simple-select-label">
            Select an expression
          </InputLabel>
          <Select
            label="Select an expression"
            defaultValue={comparerSelected ? comparerSelected : ""}
            disabled={attributeSelected.length ? false : true}
            onChange={handleComparerSelect}
          >
            {attributeSelected.length &&
              comparerModes[getFeatureAttribute(attributeSelected)].map(
                (key) => (
                  <MenuItem key={v4()} value={key.value}>
                    {key.label}
                  </MenuItem>
                ),
              )}
          </Select>
        </FormControl>
        {attributeSelected.length ? (
          <>
            {comparerSelected.length ? (
              <FilterOptionField
                comparer={
                  attributeSelected.length
                    ? [...getComparer(comparerSelected)][0]
                    : null
                }
                prop={
                  typeof attributeSelected === "string" ? attributeSelected : ""
                }
                expressionId={id}
                expression={expression}
              />
            ) : null}
          </>
        ) : null}
      </Box>
      {isLast ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: theme.spacing(8),
          }}
        >
          <Chip
            label={logicalOperator === "match_all_expressions" ? "And" : "Or"}
          />
        </Box>
      ) : null}
    </>
  );
};

export default Exppression;
