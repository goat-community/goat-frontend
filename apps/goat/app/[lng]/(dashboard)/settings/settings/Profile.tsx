"use client";

import React from "react";
import { Box } from "@mui/material";
import { makeStyles } from "@/lib/theme";
import { Text } from "@p4b/ui/components/theme";
import { v4 } from "uuid";

interface tempProfileInfoType {
  label: string;
  value: string;
  editable: boolean;
}

const Profile = () => {
  const { classes } = useStyles();

  const informatoryData: tempProfileInfoType[] = [
    {
      label: "First Name: ",
      value: "User",
      editable: true,
    },
    {
      label: "Last Name: ",
      value: "Costumer",
      editable: true,
    },
    {
      label: "Email: ",
      value: "user@gmail.com",
      editable: true,
    },
    {
      label: "Phone Number: ",
      value: "User",
      editable: true,
    },
    {
      label: "Participant in organizations: ",
      value: "LocalMapping, GOAT, Map4Ci...",
      editable: true,
    },
  ]

  return (
    <div>
      {informatoryData.map((infoData)=>(
        <Box key={v4()} className={classes.infoRow}>
          <Text typo="body 1" className={classes.label}>{infoData.label}</Text>
          <Text typo="body 1">{infoData.value}</Text>
        </Box>
      ))}
      <p style={{textAlign: "center", marginTop: "100px"}}>This data is only temporary</p>
    </div>
  );
};

const useStyles = makeStyles({ name: { Profile } })((theme) => ({
  label: {
    fontWeight: "bold",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    margin: `${theme.spacing(3)}px 0px`,
  }
}));

export default Profile;
