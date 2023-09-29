import {
  Divider,
  Stack,
  useTheme,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import React from "react";
import type { MapSidebarItem } from "@/components/map/Sidebar";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

interface ContainerProps {
  header?: React.ReactNode;
  title?: string;
  direction?: "left" | "right";
  body?: React.ReactNode;
  action?: React.ReactNode;
  close: (item: MapSidebarItem | undefined) => void;
}

export default function Container(props: ContainerProps) {
  const { header, body, action, close, title, direction = "right" } = props;

  const theme = useTheme();

  return (
    <Stack
      sx={{
        backgroundColor: theme.palette.background.paper,
        height: "100%",
      }}
    >
      <Stack
        sx={{
          paddingTop: theme.spacing(2),
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
          justifyContent: "space-between",
          alignItems: "center",
        }}
        direction="row"
      >
        {header ? (
          header
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                direction === "left" ? "space-between" : undefined,
              gap: "20px",
              width: "100%",
            }}
          >
            {direction === "right" ? (
              <IconButton onClick={() => close(undefined)}>
                <Icon
                  iconName={ICON_NAME.CHEVRON_RIGHT}
                  htmlColor={theme.palette.primary.main}
                  style={{ fontSize: "12px" }}
                />
              </IconButton>
            ) : null}
            <Typography
              color={theme.palette.primary.main}
              variant="body1"
              sx={{
                display: "flex",
                gap: theme.spacing(2),
              }}
            >
              {title}
              <Icon
                iconName={ICON_NAME.OUTILINEDINFO}
                htmlColor={theme.palette.primary.main}
                style={{ fontSize: "10px" }}
              />
            </Typography>
            {direction === "left" ? (
              <IconButton onClick={() => close(undefined)}>
                <Icon
                  iconName={ICON_NAME.CHEVRON_LEFT}
                  htmlColor={theme.palette.primary.main}
                  style={{ fontSize: "12px" }}
                />
              </IconButton>
            ) : null}
          </Box>
        )}
      </Stack>
      <Divider />
      {body && (
        <Stack
          direction="column"
          sx={{
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(7),
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
            overflowY: "auto",
            scrollbarGutter: "stable both-edges",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#2836484D",
              borderRadius: "3px",
              "&:hover": {
                background: "#28364880",
              },
            },
          }}
        >
          {body}
        </Stack>
      )}
      {action && (
        <Stack
          direction="row"
          sx={{
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(7),
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
            overflowY: "auto",
            scrollbarGutter: "stable both-edges",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#2836484D",
              borderRadius: "3px",
              "&:hover": {
                background: "#28364880",
              },
            },
          }}
        >
          {action}
        </Stack>
      )}
    </Stack>
  );
}
