import React from "react";

import { Card, useTheme, Box, styled } from "@mui/material";
import { GOATLogoGreenSvg } from "@p4b/ui/assets/svg/GOATLogoGreen";

export type BannerProps = {
  children?: React.ReactNode;
  // imageSide?: "left" | "right" | "full" | "fullBehind";
  content?: React.ReactNode;
  image?: string;
  actions?: React.ReactNode;
};

const BannerImage = styled(Box)(({ theme }) => ({
  width: imageWidthBasedOnImageSide("right"),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    borderRadius: 4,
    left: "0",
    top: "0",
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(50% 50% at 50% 50%, rgba(40,54,72,0.8) 0%, rgba(40,54,72,0.9) 100%), url(https://assets.plan4better.de/img/login/artwork_1.png) no-repeat center",
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const BannerBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(5),
  width: "69%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  color: "white",
  zIndex: "100",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

const Banner = (props) => {
  const { content, image, actions } = props;

  const theme = useTheme();

  return (
    <Card
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        position: "relative",
      }}
    >
      <Box
        sx={{
          height: "210px",
          display: "flex",
          flexDirection: "right",
        }}
      >
        <>
          <BannerBody>
            <div>{content}</div>
            <div>{actions}</div>
          </BannerBody>

          <BannerImage>
            <span
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <GOATLogoGreenSvg height={100} width={200} />
            </span>
            <div />
          </BannerImage>
        </>
      </Box>
    </Card>
  );
};

const imageWidthBasedOnImageSide = (
  side: "left" | "right" | "full" | "fullBehind",
) => {
  switch (side) {
    case "left":
    case "right":
      return "31%";
    case "full":
    case "fullBehind":
      return "100%";
  }
};

export default Banner;
