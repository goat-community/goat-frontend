"use client";

import React from "react";
import { Box } from "@mui/material";
import { makeStyles } from "@/lib/theme";
import { v4 } from "uuid";
import { TextField, Grid, Button } from "@mui/material";
import { useTheme } from "@/lib/theme";

interface tempProfileInfoType {
  label: string;
  value: string;
  editable: boolean;
}

const Profile = () => {
  const { classes, cx } = useStyles();
  const theme = useTheme();

  const informatoryData: tempProfileInfoType[] = [
    {
      label: "First Name",
      value: "User",
      editable: true,
    },
    {
      label: "Last Name",
      value: "Costumer",
      editable: true,
    },
    {
      label: "Email",
      value: "user@gmail.com",
      editable: true,
    },
    {
      label: "Phone Number",
      value: "User",
      editable: true,
    },
    {
      label: "Country",
      value: "Germany",
      editable: true,
    },
    {
      label: "Timezone",
      value: "(GMT-12:00) International Date Line West",
      editable: true,
    },
    {
      label: "Participant in organizations",
      value: "LocalMapping, GOAT, Map4Ci...",
      editable: true,
    },
  ];

  return (
    <div>
      <Grid container spacing={2} className={classes.grid}>
        {informatoryData.map((infoData) => (
          <Grid key={v4()} item xs={6}>
            <Box className={classes.infoRow}>
              <TextField
                label={infoData.label}
                className={classes.input}
                value={infoData.value}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{margin: `0px ${theme.spacing(3)}px`, marginTop: theme.spacing(2)}}>
        <Button variant="outlined" color="error" className={classes.button}>Deactivate</Button>
        <Button variant="contained" color="error" className={cx(classes.deleteButton, classes.button)}>Delete</Button>
      </Box>
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
    gap: theme.spacing(5),
    margin: `${theme.spacing(3)}px ${theme.spacing(3)}px`,
  },
  input: {
    width: "100%",
  },
  grid: {
    // gap: "20px"
  },
  deleteButton: {
    color: theme.colors.palette.light.main,
  },
  button: {
    display: "block",
    width: "100%",
    padding: "14px",
    margin: `${theme.spacing(3)}px 0px`
  }
}));

export default Profile;
