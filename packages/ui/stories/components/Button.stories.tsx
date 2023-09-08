import type { Meta, StoryObj } from "@storybook/react";

import ThemeProvider from "../../theme/ThemeProvider";
import Button from "@mui/material/Button";
import { useDarkMode } from "storybook-dark-mode";

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: ["text", "contained", "outlined"],
      control: { type: "radio" },
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
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary",
    variant: "contained",
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/tu6pPILBRSUuy3Hbu8Lphk/Goat-3.0?type=design&node-id=6543-36744&t=m1TtlHDKRmJk5wCK-0",
    },
  },
};
