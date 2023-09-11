import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import ThemeProvider from "../../theme/ThemeProvider";
import { useDarkMode } from "storybook-dark-mode";
import { Snackbar, Button, Alert } from "@mui/material";

const meta: Meta<typeof Snackbar> = {
  component: Snackbar,
  tags: ["autodocs"],
  argTypes: {
    severity: {
      options: ["error", "warning", "info", "success"],
      control: { type: "select" },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider
        settings={{
          themeColor: "primary",
          contentWidth: "boxed",
          mode: useDarkMode() ? "dark" : "light",
        }}
      >
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Snackbar>;

export const Default: Story = {
  args: {
    children: "This is an error alert — check it out!",
    severity: "error",
  },
  render: (args) => {
    const { severity, children, ...rest } = args;
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
      setOpen(true);
    };

    const handleClose = (
      _?: React.SyntheticEvent | Event,
      reason?: string,
    ) => {
      if (reason === "clickaway") {
        return;
      }

      setOpen(false);
    };

    return (
      <div>
        <Button variant="outlined" onClick={handleClick}>
          Open success snackbar
        </Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {children}
          </Alert>
        </Snackbar>
      </div>
    );
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/tu6pPILBRSUuy3Hbu8Lphk/Root_Goat-3.0?type=design&node-id=6583-46474&mode=design&t=9dTs5ps2RVfIB1th-0",
    },
  },
};
