import type { SelectChangeEvent } from "@mui/material";
import {
  Divider,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  useTheme
} from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useDispatch } from "react-redux";
import {
  deleteLayerFillOutLineColor,
  setLayerFillOutLineColor,
} from "@/lib/store/styling/slice";

const SelectStrokeOptionFill = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    if (event.target.value === "line") {
      dispatch(setLayerFillOutLineColor("#000"));
    } else if (event.target.value === "empty") {
      dispatch(deleteLayerFillOutLineColor());
    }
  };

  return (
    <Box>
      <Accordion>
        <AccordionSummary
          expandIcon={<Icon iconName={ICON_NAME.CHEVRON_DOWN} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{
            padding: "0 16px",
          }}
        >
          <Typography>Color</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: "0 16px",
          }}
        >
          <FormControl sx={{ m: 1, width: "100%" }}>
            <Select
              size="small"
              sx={{
                "& .MuiSelect-select": {
                  display: "flex",
                  columnGap: "8px",
                  alignItems: "center",
                },
              }}
              defaultValue="line"
              onChange={handleSelectChange}
            >
              <MenuItem
                value="empty"
                sx={{
                  display: "flex",
                  columnGap: "8px",
                  alignItems: "center",
                  height: "32px",
                }}
              >
                <Icon
                  iconName={ICON_NAME.CLOSE}
                  htmlColor={theme.palette.error.main}
                  fontSize="small"
                />
                <Typography variant="body2">Hide stroke</Typography>
              </MenuItem>
              <MenuItem
                value="line"
                sx={{
                  display: "flex",
                  columnGap: "8px",
                  alignItems: "center",
                  height: "32px",
                }}
              >
                <Divider
                  sx={{
                    width: "100%",
                    borderTop: "none",
                    borderBottom: "1px solid black",
                  }}
                />
              </MenuItem>
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SelectStrokeOptionFill;
