import type { Theme } from "@mui/material/styles";

const CssBaseline = (theme: Theme) => {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          "& ::-webkit-scrollbar": {
            width: "5px",
          },
          "& ::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "& ::-webkit-scrollbar-thumb": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? "#374A62"
                : theme.palette.grey[400],
            borderRadius: "5px",
          },
        },
        body: {
          overflow: "hidden",
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
          position: "fixed",
        },
      },
    },
  };
};

export default CssBaseline;
