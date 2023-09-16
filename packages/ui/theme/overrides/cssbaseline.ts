const CssBaseline = () => {
  return {
    MuiCssBaseline: {
      styleOverrides: {
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
