import type { Meta, StoryObj } from "@storybook/react";

import DropFieldFileInput from "../../components/DropFieldFileInput";
import { ThemeProvider } from "../../stories/theme";

const meta: Meta<typeof DropFieldFileInput> = {
  component: DropFieldFileInput,
  tags: ["autodocs"],
  argTypes: {},
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DropFieldFileInput>;

export const Primary: Story = {
  args: {},
};
