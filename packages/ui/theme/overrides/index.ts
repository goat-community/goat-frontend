import { Theme } from "@mui/material/styles";

import MuiAvatar from "./avatar";
import Button from "./button";
import MuiCard from "./card";
const Overrides = (theme: Theme) => {
  return {
    ...MuiAvatar(theme),
    ...Button(theme),
    ...MuiCard(theme),
  };
};

export default Overrides;
