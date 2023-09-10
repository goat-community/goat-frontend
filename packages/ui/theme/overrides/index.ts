import type { Theme } from "@mui/material/styles";

import MuiAvatar from "./avatar";
import Button from "./button";
import MuiCard from "./card";
import Link from "./link";
const Overrides = (theme: Theme) => {
  return {
    ...MuiAvatar(theme),
    ...Button(theme),
    ...MuiCard(theme),
    ...Link(),
  };
};

export default Overrides;
