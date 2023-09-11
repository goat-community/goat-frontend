import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import ThemeProvider from "../../theme/ThemeProvider";
import { useDarkMode } from "storybook-dark-mode";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Icon, ICON_NAME } from "../../components/Icon";

const meta: Meta<typeof ToggleButton> = {
  component: ToggleButton,
  tags: ["autodocs"],
  argTypes: {
    // severity: {
    //   options: ["error", "warning", "info", "success"],
    //   control: { type: "select" },
    // },
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
type Story = StoryObj<typeof ToggleButton>;

export const Default: Story = {
  args: {},
  render: (args) => {
    const { ...rest } = args;

    const [alignment, setAlignment] = React.useState<string | null>("left");

    const handleAlignment = (
      _: React.MouseEvent<HTMLElement>,
      newAlignment: string | null,
    ) => {
      setAlignment(newAlignment);
    };

    return (
      <ToggleButtonGroup
        value={alignment}
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment"
      >
        <ToggleButton value="left" aria-label="left aligned">
          <Icon iconName={ICON_NAME.EMAIL}></Icon>
        </ToggleButton>
        <ToggleButton value="center" aria-label="centered">
          <Icon iconName={ICON_NAME.CHART}></Icon>
        </ToggleButton>
        <ToggleButton value="right" aria-label="right aligned">
          <Icon iconName={ICON_NAME.FILTER}></Icon>
        </ToggleButton>
        <ToggleButton value="justify" aria-label="justified" disabled>
          <Icon iconName={ICON_NAME.STEPUP}></Icon>
        </ToggleButton>
      </ToggleButtonGroup>
    );
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/tu6pPILBRSUuy3Hbu8Lphk/Root_Goat-3.0?type=design&node-id=6583-46474&mode=design&t=9dTs5ps2RVfIB1th-0",
    },
  },
};
