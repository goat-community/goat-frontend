"use client";

import type { PopperMenuItem } from "@/components/common/PopperMenu";
import MoreMenu from "@/components/common/PopperMenu";
import { useDateFnsLocale, useTranslation } from "@/i18n/client";
import type { Layer } from "@/lib/validations/layer";
import type { Project } from "@/lib/validations/project";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  IconButton,
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
  item: Project | Layer;
  moreMenuOptions?: PopperMenuItem[];
  onMoreMenuSelect?: (
    menuItem: PopperMenuItem,
    contentItem: Project | Layer,
  ) => void;
  enableActions?: boolean;
  selected?: Project | Layer;
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
  const { cardType, item, enableActions = true } = props;
  const theme = useTheme();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const { t } = useTranslation("common");
  const dateLocale = useDateFnsLocale();
  const moreMenu = (
    <MoreMenu
      disablePortal={false}
      menuItems={props.moreMenuOptions ?? []}
      menuButton={
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
      }
      onSelect={(menuItem: PopperMenuItem) => {
        setMoreMenuOpen(false);
        props.onMoreMenuSelect?.(menuItem, item);
      }}
    />
  );

  const updatedAtText = (
    <>
      {item?.updated_at && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ pb: 0 }}>
          <Typography variant="caption" noWrap>
            {t("last_updated")}:{" "}
            {formatDistance(new Date(item.updated_at), new Date(), {
              addSuffix: true,
              locale: dateLocale,
            })}
          </Typography>
        </Stack>
      )}
    </>
  );

  const createdAtText = (
    <>
      {item?.created_at && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ pb: 0 }}>
          <Typography variant="caption" noWrap>
            {t("created")}:{" "}
            {formatDistance(new Date(item.created_at), new Date(), {
              addSuffix: true,
              locale: dateLocale,
            })}
          </Typography>
        </Stack>
      )}
    </>
  );

  const cardTitle = (
    <>
      {item?.name && (
        <Typography variant="body1" noWrap>
          {item.name}
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
        <CardTags tags={item.tags} maxTags={3} />
      </Box>
    </>
  );

  return (
    <>
      <Card
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
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
          ...(props.selected?.id === item?.id && {
            backgroundColor: "rgba(43, 179, 129, 0.08)",
            fontWeight: "bold",
          }),
          flexDirection: cardType === "grid" ? "column" : "row",
        }}
      >
        {item?.thumbnail_url && cardType === "grid" && (
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
              image={item.thumbnail_url}
            />
          </Box>
        )}

        {item?.thumbnail_url && cardType === "list" && (
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
              image={item.thumbnail_url}
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
              {enableActions && (
                <>
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
                      <CardTags tags={item?.tags} maxTags={1} />
                    </Box>
                  </Grid>
                  <Grid item sm={1}>
                    <Box display="flex" justifyContent="flex-end">
                      {moreMenu}
                    </Box>
                  </Grid>
                </>
              )}
              {!enableActions && (
                <Grid item xs={12}>
                  {cardTitle}
                </Grid>
              )}
            </Grid>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TileCard;
