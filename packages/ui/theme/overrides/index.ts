import { Theme } from "@mui/material/styles";

import MuiAvatar from "./avatar";
import Button from "./button";
import Card from "./card";

const Overrides = (theme: Theme) => {
  return {
    ...MuiAvatar(theme),
    ...Button(theme),
    ...Card(theme),
  };
};

export default Overrides;
