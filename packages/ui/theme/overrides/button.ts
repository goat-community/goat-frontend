import { Theme } from "@mui/material/styles";

const Button = (theme: Theme) => {
  return {
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
      styleOverrides: {
        root: {
          borderRadius: 50,
          lineHeight: 1.71,
          letterSpacing: "0.3px",
          padding: `${theme.spacing(1.875, 3)}`,
          '&.MuiButton-containedPrimary:not(:disabled)': {
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          },
        },
        contained: {
          boxShadow: theme.shadows[3],
          padding: `${theme.spacing(1.875, 5.5)}`,
        },
        outlined: {
          padding: `${theme.spacing(1.625, 5.25)}`,
        },
        sizeSmall: {
          padding: `${theme.spacing(1, 2.25)}`,
          "&.MuiButton-contained": {
            padding: `${theme.spacing(1, 3.5)}`,
          },
          "&.MuiButton-outlined": {
            padding: `${theme.spacing(0.75, 3.25)}`,
          },
        },
        sizeLarge: {
          padding: `${theme.spacing(2.125, 5.5)}`,
          "&.MuiButton-contained": {
            padding: `${theme.spacing(2.125, 6.5)}`,
          },
          "&.MuiButton-outlined": {
            padding: `${theme.spacing(1.875, 6.25)}`,
          },
        },
      },
    },
  };
};

export default Button;
