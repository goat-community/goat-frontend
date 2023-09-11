import { Theme } from "@mui/material/styles";

const MuiPaper = (theme: Theme) => {
  return {
    styleOverrides: {
      root: {
        backgroundImage: 'none'
      }
    }
  };
};

export default MuiPaper;
