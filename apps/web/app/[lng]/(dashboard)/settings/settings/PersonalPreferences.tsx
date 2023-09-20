"use client";

import React from "react";
import { v4 } from "uuid";
import type { Option } from "@p4b/types/atomicComponents";
import { useTranslation } from "react-i18next";
import { useRouter, usePathname } from "next/navigation";
import {
  Typography,
  Divider,
  Switch,
  Box,
  Card,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

function removeNrOfElementsFromArray(pathname: string, len: number) {
  const parts = pathname.split("/");
  if (parts.length >= len) {
    parts.splice(0, len);
  }
  return parts.join("/");
}

const PersonalPreferences = () => {
  const theme = useTheme();

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

  const changeLanguage = (locale: string) => {
    i18n.changeLanguage(locale);
    const pathnameWithoutLocale = removeNrOfElementsFromArray(pathname, 2);
    router.push(`/${locale}/${pathnameWithoutLocale}`);
  };

  return (
    <div>
      <Box key={v4()} sx={{ marginBottom: "100px" }}>
        <Card
          sx={{
            width: "100%",
            margin: `${theme.spacing(5)} 0px`,
            borderRadius: "4px",
          }}
        >
          <Box sx={{ padding: "15px", paddingLeft: "25px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Language</Typography>
            <Typography variant="caption">Manage the sites language</Typography>
          </Box>
          <Divider />
          <Box
            sx={{
              padding: "20px 25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography>Language</Typography>
            <Select
              sx={{ width: "50%" }}
              onChange={(e: SelectChangeEvent<string>) =>
                changeLanguage(e.target.value)
              }
              defaultValue={i18n.language}
              label=""
              size="small"
            >
              {options.map((option) => (
                <MenuItem key={v4()} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Card>
        <Card
          sx={{
            width: "100%",
            margin: `${theme.spacing(5)} 0px`,
            borderRadius: "4px",
          }}
        >
          <Box sx={{ padding: "15px", paddingLeft: "25px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Notification</Typography>
            <Typography variant="caption">
              Manage the notification settings & modes
            </Typography>
          </Box>
          <Divider />
          <Box
            sx={{
              padding: "20px  25px",
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
              padding: "20px  25px",
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
          sx={{
            margin: `${theme.spacing(5)} 0px`,
            borderRadius: "4px",
            width: "100%",
          }}
        >
          <Box sx={{ padding: "15px", paddingLeft: "25px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Theme</Typography>
            <Typography variant="caption">
              Chose between Dark & Light modes
            </Typography>
          </Box>
          <Divider />
          <Box
            sx={{
              padding: "20px  25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography>Dark</Typography>
            <Switch />
          </Box>
        </Card>
        <Card
          sx={{
            margin: `${theme.spacing(5)} 0px`,
            borderRadius: "4px",
            width: "100%",
          }}
        >
          <Box sx={{ padding: "15px", paddingLeft: "25px" }}>
            <Typography sx={{ fontWeight: "bold" }}>Newsletter</Typography>
            <Typography variant="caption">
              Subscribe to our Newsletter
            </Typography>
          </Box>
          <Divider />
          <Box
            sx={{
              padding: "20px  25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography>Subscribe</Typography>
            <Switch />
          </Box>
        </Card>
      </Box>
    </div>
  );
};

export default PersonalPreferences;
