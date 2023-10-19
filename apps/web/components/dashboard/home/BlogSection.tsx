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
    thumbnail: "https://plan4better.de/images/blog/mrn/thumbnail.webp",
    url: "https://plan4better.de/en/posts/2023-08-07-mrn/",
  },
  {
    title:
      "Mobility concepts for parking space reduction: Innovative approaches and tools",
    date: "August 1, 2023",
    thumbnail: "https://plan4better.de/images/blog/parking/thumbnail.webp",
    url: "https://plan4better.de/en/posts/2023-08-01-parking/",
  },
  {
    title: "Green Spaces in Urban Areas: The Key to Resilient Cities",
    date: "May 30, 2023",
    thumbnail:
      "https://plan4better.de/images/blog/green-spaces-resilient-cities/thumbnail.webp",
    url: "https://plan4better.de/en/posts/2023-05-01-accessibility-to-green-spaces/",
  },
  {
    title: "GOAT Anwendungsbeispiel: Stadtplanung",
    date: "April 17, 2023",
    thumbnail:
      "https://plan4better.de/images/blog/use-cases-development-concepts/stadtplanung_900450.webp",
    url: "https://plan4better.de/posts/2023-03-01-goat-anwendungsbeispiel-stadtplanung/",
  },
];

interface BlogSectionProps {
  lng: string;
}

const BlogSection = (props: BlogSectionProps) => {
  const isLoading = false;
  const theme = useTheme();
  const {lng} = props;
  const { t } = useTranslation(lng, "dashboard");

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">{t("home.explore")}</Typography>
        <Button
          variant="text"
          size="small"
          endIcon={
            <Icon iconName={ICON_NAME.EXTERNAL_LINK} style={{ fontSize: 12 }} />
          }
          onClick={() =>
            window.open("https://plan4better.de/en/blog/", "_blank")
          }
          sx={{
            borderRadius: 0,
          }}
        >
          {t("home.visit_blog")}
        </Button>
      </Box>
      <Divider sx={{ mb: 4 }} />
      <Grid container spacing={5}>
        {(isLoading ? Array.from(new Array(3)) : blogPosts ?? []).map(
          (item: BlogPost, index: number) => (
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
              }}
            >
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
                  }}
                >
                  {item.thumbnail && (
                    <CardMedia
                      component="img"
                      sx={{
                        height: 220,
                        objectFit: "cover",
                        backgroundSize: "cover",
                        transition: theme.transitions.create(
                          ["box-shadow", "transform"],
                          {
                            duration: theme.transitions.duration.standard,
                          },
                        ),
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
                          transition: theme.transitions.create(
                            ["color", "transform"],
                            {
                              duration: theme.transitions.duration.standard,
                            },
                          ),
                        }}
                        fontWeight="bold"
                      >
                        {item.title}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Grid>
          ),
        )}
      </Grid>
    </Box>
  );
};

export default BlogSection;
