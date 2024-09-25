import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";

import { useTranslation } from "@/i18n/client";

type BlogPost = {
  title: string;
  date: string;
  thumbnail: string;
  url: string;
};

const blogPosts: BlogPost[] = [
  {
    title: "GOAT as a cross-stakeholder planning platform in the MRN",
    date: "August 22, 2023",
    thumbnail: "https://cdn.prod.website-files.com/6554ce5f672475c1f40445af/65e5b56beac81eec44c6c21e_banner%20(1).webp",
    url: "https://www.plan4better.de/en/post/goat-as-a-cross-stakeholder-planning-platform-in-the-mrn/",
  },
  {
    title: "Mobility concepts for parking space reduction: Innovative approaches and tools",
    date: "August 1, 2023",
    thumbnail: "https://cdn.prod.website-files.com/6554ce5f672475c1f40445af/65e5b1ea6eb4e8f5c1ae5624_banner-p-1080.webp",
    url: "https://www.plan4better.de/en/post/mobility-concepts-for-parking-space-reduction-innovative-approaches-and-tools",
  },
  {
    title: "Green Spaces in Urban Areas: The Key to Resilient Cities",
    date: "May 30, 2023",
    thumbnail: "https://cdn.prod.website-files.com/6554ce5f672475c1f40445af/65e5b05fbeebb602470e235c_top_image_50-p-1080.webp",
    url: "https://www.plan4better.de/en/post/green-spaces-in-urban-areas-the-key-to-resilient-cities",
  },
];

const BlogSection = () => {
  const isLoading = false;
  const theme = useTheme();
  const { t } = useTranslation("common");

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}>
        <Typography variant="h6">{t("explore")}</Typography>
        <Button
          variant="text"
          size="small"
          endIcon={<Icon iconName={ICON_NAME.EXTERNAL_LINK} style={{ fontSize: 12 }} />}
          onClick={() => window.open("https://plan4better.de/en/blog/", "_blank")}
          sx={{
            borderRadius: 0,
          }}>
          {t("visit_blog")}
        </Button>
      </Box>
      <Divider sx={{ mb: 4 }} />
      <Grid container spacing={5}>
        {(isLoading ? Array.from(new Array(3)) : blogPosts ?? []).map((item: BlogPost, index: number) => (
          <Grid
            item
            key={item?.title ?? index}
            xs={12}
            sm={6}
            md={6}
            lg={4}
            display={{
              sm: index > 3 ? "none" : "block",
              md: index > 3 ? "none" : "block",
              lg: index > 2 ? "none" : "block",
            }}>
            {!item ? (
              <Skeleton variant="rectangular" height={220} />
            ) : (
              <Card
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  boxShadow: "none",
                }}
                variant="outlined"
                onClick={() => window.open(item.url, "_blank")}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    cursor: "pointer",
                    "& img": {
                      boxShadow: theme.shadows[4],
                    },
                    "& p": {
                      color: theme.palette.primary.main,
                    },
                  },
                }}>
                {item.thumbnail && (
                  <CardMedia
                    component="img"
                    sx={{
                      height: 220,
                      objectFit: "cover",
                      backgroundSize: "cover",
                      transition: theme.transitions.create(["box-shadow", "transform"], {
                        duration: theme.transitions.duration.standard,
                      }),
                    }}
                    image={item.thumbnail}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, px: 0 }}>
                  <Stack spacing={2}>
                    <Typography gutterBottom variant="caption">
                      {item.date}
                    </Typography>

                    <Typography
                      sx={{
                        transition: theme.transitions.create(["color", "transform"], {
                          duration: theme.transitions.duration.standard,
                        }),
                      }}
                      fontWeight="bold">
                      {item.title}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BlogSection;
