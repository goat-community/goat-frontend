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
        <Text typo="body 1" className={classes.label}>
          Language:
        </Text>
        <SelectField
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
    </div>
  );
};

const useStyles = makeStyles({ name: { PersonalPreferences } })((theme) => ({
  label: {
    fontWeight: "bold",
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    margin: `${theme.spacing(3)}px 0px`,
  },
}));

export default PersonalPreferences;
