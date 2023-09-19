import React from "react";

import { Typography, TextField, Box, useTheme } from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

interface InviteUserProps {
  setEmail: (value: string) => void;
}

const InviteUser = (props: InviteUserProps) => {
  const { setEmail } = props;

  const theme = useTheme();

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing(2),
          marginBottom: theme.spacing(3),
        }}
      >
        <Icon
          iconName={ICON_NAME.HOUSE}
          fontSize="small"
          sx={{
            backgroundColor: `${theme.palette.secondary.light}80`,
            fontSize: "20px",
            height: "1.5em",
            width: "1.5em",
            padding: "5px 7px",
            borderRadius: "100%",
          }}
        />
        <Typography variant="body1">Organization name</Typography>
      </Box>
      <Typography variant="body2">
        Send an invitation via email <br /> The receiver will get a link with 72
        hours of expiration
      </Typography>
      <Box
        sx={{
          marginTop: theme.spacing(3),
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing(2),
        }}
      >
        <TextField
          size="small"
          type="email"
          label="Email address"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
      </Box>
    </div>
  );
};

export default InviteUser;
