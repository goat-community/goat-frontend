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
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { formatDistance } from "date-fns";
import { useState } from "react";

export interface TileCard {
  cardType: "list" | "grid";
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
  layerType?: string;
  description?: string;
  tags?: string[];
  image?: string;
}

export interface ActiveCard {
  id: string;
  type: "project" | "layer";
  title: string;
}

interface CardTagsProps {
  tags?: string[];
  maxTags?: number;
}

const CardTags = ({ tags, maxTags = 5 }: CardTagsProps) => {
  const visibleTags = tags?.slice(0, maxTags);
  const hiddenTags = tags?.slice(maxTags);

  return (
    <>
      {tags && (
        <Stack direction="row" spacing={2}>
          {visibleTags?.map((tag) => (
            <Chip
              key={tag}
              size="small"
              sx={{ px: 1, maxWidth: 100 }}
              label={tag}
            />
          ))}
          {hiddenTags && hiddenTags.length > 0 && (
            <Grid item md="auto" key="show-more">
              <Tooltip title={hiddenTags.join(", ")} placement="top" arrow>
                <div>
                  <Chip
                    size="small"
                    sx={{ px: 1, maxWidth: 100 }}
                    label={`+${hiddenTags.length}`}
                  />
                </div>
              </Tooltip>
            </Grid>
          )}
        </Stack>
      )}
    </>
  );
};

const TileCard = (props: TileCard) => {
  const {
    cardType,
    title,
    id,
    contentType,
    updatedAt,
    createdAt,
    tags,
    image,
    layerType,
  } = props;
  const theme = useTheme();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [activeContent, setActiveContent] = useState<ActiveCard | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const moreMenu = (
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
        <Icon
          iconName={
            cardType === "grid" ? ICON_NAME.MORE_VERT : ICON_NAME.MORE_HORIZ
          }
          fontSize="small"
        />
      </IconButton>
    </ArrowPopper>
  );

  const updatedAtText = (
    <>
      {updatedAt && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ pb: 0 }}>
          <Typography variant="caption" noWrap>
            Last updated:{" "}
            {formatDistance(new Date(updatedAt), new Date(), {
              addSuffix: true,
            })}
          </Typography>
        </Stack>
      )}
    </>
  );

  const createdAtText = (
    <>
      {createdAt && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ pb: 0 }}>
          <Typography variant="caption" noWrap>
            Created:{" "}
            {formatDistance(new Date(createdAt), new Date(), {
              addSuffix: true,
            })}
          </Typography>
        </Stack>
      )}
    </>
  );

  const cardTitle = (
    <>
      {title && (
        <Typography variant="body1" noWrap>
          {title}
        </Typography>
      )}
    </>
  );

  const gridContent = (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ pb: theme.spacing(2) }}
      >
        {cardTitle}
        {moreMenu}
      </Stack>
      {/* Created by info  */}
      {updatedAtText}
      {/* Tags */}
      <Box sx={{ mt: theme.spacing(2) }} display="flex-start">
        <CardTags tags={tags} maxTags={3} />
      </Box>
    </>
  );

  return (
    <>
      <DeleteContentModal
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={() => {
          setIsDeleteDialogOpen(false);
          setActiveContent(null);
        }}
        activeContent={activeContent}
      />
      <Card
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: cardType === "grid" ? "column" : "row",
          ...(cardType === "list" && {
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            alignItems: "center",
            borderRadius: 0,
            boxShadow: 0,
          }),
          "&:hover": {
            cursor: "pointer",
            boxShadow: cardType === "grid" ? 10 : 0,
            "& img": {
              ...(cardType === "grid" && {
                transform: "scale(1.2)",
              }),
            },
          },
        }}
      >
        {image && cardType === "grid" && (
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
            {layerType && (
              <Chip
                color="primary"
                variant="filled"
                size="small"
                sx={{
                  position: "absolute",
                  top: 15,
                  right: 15,
                }}
                label={layerType}
              />
            )}
          </Box>
        )}

        {image && cardType === "list" && (
          <Box
            sx={{
              overflow: "hidden",
              height: 56,
              width: 56,
              borderRadius: 1,
            }}
          >
            <CardMedia
              component="img"
              sx={{
                height: 56,
                width: 56,
                transformOrigin: "center center",
                objectFit: "cover",
                backgroundSize: "cover",
                border: `1px solid ${theme.palette.divider}`,
              }}
              image={image}
            />
          </Box>
        )}

        <CardContent
          sx={{
            flexGrow: 1,
            py: cardType === "grid" ? 2 : 0,
            ...(cardType === "list" && {
              "&:last-child": { pb: 0 },
            }),
          }}
        >
          {cardType === "grid" && gridContent}
          {cardType === "list" && (
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item xs={11} sm={5} md={4}>
                {cardTitle}
              </Grid>
              <Grid
                item
                sm={4}
                md={3}
                sx={{
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Box sx={{ px: 1, pb: 0 }} display="flex-start">
                  {updatedAtText}
                </Box>
              </Grid>
              <Grid
                item
                md={3}
                sx={{
                  display: { xs: "none", md: "block" },
                }}
              >
                <Box sx={{ px: 1, pb: 0 }} display="flex-start">
                  {createdAtText}
                </Box>
              </Grid>
              <Grid
                item
                md={1}
                sm={2}
                sx={{
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Box display="flex-start">
                  <CardTags tags={tags} maxTags={1} />
                </Box>
              </Grid>
              <Grid item sm={1}>
                <Box display="flex" justifyContent="flex-end">
                  {moreMenu}
                </Box>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TileCard;
