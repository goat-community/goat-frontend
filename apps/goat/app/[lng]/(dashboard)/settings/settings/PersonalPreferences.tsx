"use client";

import React from "react";
import { makeStyles } from "@/lib/theme";
import { Box } from "@mui/material";
import { Text } from "@p4b/ui/components/theme";
import { v4 } from "uuid";
import { SelectField } from "@p4b/ui/components/Inputs";
import type { Option } from "@p4b/types/atomicComponents";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";
import { Card } from "@p4b/ui/components/Surfaces";
import { Typography, Divider, Switch } from "@mui/material";
import { useTheme } from "@/lib/theme";

function removeNrOfElementsFromArray(pathname: string, len: number) {
  const parts = pathname.split("/");
  if (parts.length >= len) {
    parts.splice(0, len);
  }
  return parts.join("/");
}

const PersonalPreferences = () => {
  const { classes } = useStyles();

  const { i18n } = useTranslation("home");
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const options: Option[] = [
    {
      label: "Eng",
      value: "en",
    },
    {
      label: "Deu",
      value: "de",
    },
  ];

  const changeLanguage = (locale) => {
    i18n.changeLanguage(locale);
    const pathnameWithoutLocale = removeNrOfElementsFromArray(pathname, 2);
    router.push(`/${locale}/${pathnameWithoutLocale}`);
  };

  return (
    <div>
      <Box key={v4()} className={classes.infoRow}>
        <Card
          noHover={true}
          className={classes.card}
          width="100%"
          aboveDivider={
            <>
              <Box sx={{ padding: "15px", paddingLeft: "25px" }}>
                <Typography className={classes.title}>Language</Typography>
                <Typography variant="caption">
                  Manage the sites language
                </Typography>
              </Box>
              <Divider />
            </>
          }
        >
          <Box
            sx={{
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography>Language</Typography>
            <SelectField
              className={classes.selectField}
              updateChange={(value: string) => changeLanguage(value)}
              defaultValue={i18n.language}
              options={options.map((option) => ({
                name: option.label,
                value: option.value,
              }))}
              label=""
              size="small"
            />
          </Box>
        </Card>
        <Card
          noHover={true}
          className={classes.card}
          width="100%"
          aboveDivider={
            <>
              <Box sx={{ padding: "15px", paddingLeft: "25px" }}>
                <Typography className={classes.title}>Notification</Typography>
                <Typography variant="caption">
                  Manage the notification settings & modes
                </Typography>
              </Box>
              <Divider />
            </>
          }
        >
          <Box
            sx={{
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography>Email</Typography>
            <Switch />
          </Box>
          <Box
            sx={{
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography>Phone</Typography>
            <Switch />
          </Box>
        </Card>
        <Card
          noHover={true}
          className={classes.card}
          width="100%"
          aboveDivider={
            <>
              <Box sx={{ padding: "15px", paddingLeft: "25px" }}>
                <Typography className={classes.title}>Theme</Typography>
                <Typography variant="caption">
                  Chose between Dark & Light modes
                </Typography>
              </Box>
              <Divider />
            </>
          }
        >
          <Box
            sx={{
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography>Dark</Typography>
            <Switch />
          </Box>
        </Card>
      </Box>
    </div>
  );
};

const useStyles = makeStyles({ name: { PersonalPreferences } })((theme) => ({
  label: {
    fontWeight: "bold",
  },
  infoRow: {
    // display: "flex",
    // alignItems: "center",
    // gap: theme.spacing(2),
  },
  card: {
    // padding: "20px",
    margin: `${theme.spacing(3)}px 0px`,
    borderRadius: 8,
  },
  title: {
    fontWeight: "bold",
  },
  selectField: {
    width: "50%",
  },
}));

export default PersonalPreferences;
