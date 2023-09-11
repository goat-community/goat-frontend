import { Theme } from "@mui/material/styles";

const MuiSelect = (theme: Theme) => {
  return {
    styleOverrides: {
      select: {
        minWidth: "6rem !important",
        "&.MuiTablePagination-select": {
          minWidth: "1rem !important",
        },
      },
    },
  };
};

export default MuiSelect;
