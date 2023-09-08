import { Theme } from "@mui/material/styles";

import MuiAvatar from "./avatar";
import Button from "./button";
const Overrides = (theme: Theme) => {
  return {
    ...MuiAvatar(theme),
    ...Button(theme),
  };
};

export default Overrides;
