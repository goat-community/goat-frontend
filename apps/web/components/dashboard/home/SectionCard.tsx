"use client";

import { ArrowPopper } from "@/components/ArrowPoper";
import DeleteContentModal from "@/components/modals/DeleteContent";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { formatDistance } from "date-fns";
import { useState } from "react";

export interface SectionCard {
  createdAt?: string;
  updatedAt?: string;
  ownerInfo?: {
    name: string;
    avatar: string;
  };
  updatedBy?: {
    name: string;
    avatar: string;
  };
  id: string;
  title: string;
  contentType: "project" | "layer";
  description?: string;
  tags?: string[];
  image?: string;
}

export interface ActiveCard {
  id: string;
  type: "project" | "layer";
  title: string;
}

const SectionCard = (props: SectionCard) => {
  const { title, id, contentType, updatedAt, tags, image } = props;
  const theme = useTheme();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [activeContent, setActiveContent] = useState<ActiveCard | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DeleteContentModal
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        activeContent={activeContent}
      />
      <Card
        // onClick={() => console.log("clicked")}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            cursor: "pointer",
            boxShadow: 10,
            "& img": {
              transform: "scale(1.2)",
            },
          },
        }}
      >
        {image && (
          <Box
            sx={{
              overflow: "hidden",
              height: 140,
            }}
          >
            <CardMedia
              component="img"
              sx={{
                height: 140,
                transition: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                transformOrigin: "center center",
                objectFit: "cover",
                backgroundSize: "cover",
              }}
              image={image}
            />
          </Box>
        )}

        <CardContent sx={{ flexGrow: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ pb: theme.spacing(2) }}
          >
            {title && (
              <Typography variant="body1" noWrap>
                {title}
              </Typography>
            )}
            <ArrowPopper
              open={moreMenuOpen}
              placement="bottom"
              onClose={() => setMoreMenuOpen(false)}
              arrow={false}
              content={
                <Paper
                  elevation={8}
                  sx={{
                    minWidth: 220,
                    maxWidth: 340,
                    overflow: "auto",
                    py: theme.spacing(2),
                  }}
                >
                  <List dense={true} disablePadding>
                    <ListItemButton>
                      <ListItemIcon
                        sx={{
                          color: "inherit",
                          pr: 4,
                          minWidth: 0,
                        }}
                      >
                        <Icon
                          iconName={ICON_NAME.EDIT}
                          style={{ fontSize: 15 }}
                          htmlColor="inherit"
                        />
                      </ListItemIcon>
                      <ListItemText primary="Edit Name & Description" />
                    </ListItemButton>
                    <ListItemButton>
                      <ListItemIcon
                        sx={{
                          color: "inherit",
                          pr: 4,
                          minWidth: 0,
                        }}
                      >
                        <Icon
                          iconName={ICON_NAME.SHARE}
                          style={{ fontSize: 15 }}
                          htmlColor="inherit"
                        />
                      </ListItemIcon>
                      <ListItemText primary="Share" />
                    </ListItemButton>
                    <ListItemButton
                      sx={{
                        color: theme.palette.error.main,
                      }}
                      onClick={() => {
                        setActiveContent({
                          id,
                          type: contentType,
                          title,
                        });
                        setIsDeleteDialogOpen(true);
                        setMoreMenuOpen(false);
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: "inherit",
                          pr: 4,
                          minWidth: 0,
                        }}
                      >
                        <Icon
                          iconName={ICON_NAME.TRASH}
                          style={{ fontSize: 15 }}
                          htmlColor="inherit"
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary="Delete"
                        sx={{
                          "& .MuiTypography-root": {
                            color: theme.palette.error.main,
                          },
                        }}
                      />
                    </ListItemButton>
                  </List>
                </Paper>
              }
            >
              <IconButton
                size="medium"
                onClick={() => {
                  setMoreMenuOpen(!moreMenuOpen);
                }}
                sx={{
                  marginRight: "-12px",
                }}
              >
                <Icon iconName={ICON_NAME.MORE_VERT} fontSize="small" />
              </IconButton>
            </ArrowPopper>
          </Stack>
          {/* Created by info  */}
          {updatedAt && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ pb: theme.spacing(2) }}
            >
              <Typography variant="caption" noWrap>
                Last updated:{" "}
                {formatDistance(new Date(updatedAt), new Date(), {
                  addSuffix: true,
                })}
              </Typography>
            </Stack>
          )}
          {tags && (
            <Grid container spacing={2} sx={{ pt: theme.spacing(2) }}>
              {tags &&
                tags.length > 0 &&
                tags.map((tag, index) => (
                  <Grid
                    item
                    md="auto"
                    display={{ md: index > 5 ? "none" : "block" }}
                    key={tag}
                  >
                    <Chip
                      sx={{ px: theme.spacing(1), maxWidth: 140 }}
                      label={tag}
                    />
                  </Grid>
                ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default SectionCard;
