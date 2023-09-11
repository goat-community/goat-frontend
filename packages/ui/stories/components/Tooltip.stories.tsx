import type { Meta, StoryObj } from "@storybook/react";

import ThemeProvider from "../../theme/ThemeProvider";
import { Tooltip } from "@mui/material";
import { useDarkMode } from "storybook-dark-mode";

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {},
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
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    children: "Tooltip",
    title: "Tooltip"
  },
  render: (args) => {
    const { children, title, ...rest } = args;
    return <Tooltip title={title}>{children}</Tooltip>;
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/file/tu6pPILBRSUuy3Hbu8Lphk/Root_Goat-3.0?type=design&node-id=6583-46474&mode=design&t=9dTs5ps2RVfIB1th-0",
    },
  },
};
