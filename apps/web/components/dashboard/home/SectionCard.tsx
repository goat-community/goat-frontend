"use client";

import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";

export interface SectionCard {
  title: string;
  description?: string;
  tags?: string[];
  image?: string;
}

const SectionCard = (props: SectionCard) => {
  const { title, description, tags, image } = props;
  const theme = useTheme();
  return (
    <>
      <Card
        onClick={() => console.log("clicked")}
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
          {description && (
            <Typography gutterBottom variant="body2">
              {description}
            </Typography>
          )}

          {title && (
            <Typography gutterBottom variant="body1">
              {title}
            </Typography>
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
