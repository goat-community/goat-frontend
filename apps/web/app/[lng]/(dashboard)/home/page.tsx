"use client";

// Import statements
import React from "react";
import axios from "axios";
import { v4 } from "uuid";
import useSWR from "swr";

import GridContainer from "@/components/grid/GridContainer";
import SingleGrid from "@/components/grid/SingleGrid";
import Box from "@p4b/ui/components/Box";
import { makeStyles } from "@/lib/theme";
import { HOME_CARDS_API_URI } from "@/lib/api/apiConstants";
import { slideShowImages } from "@/public/assets/data/homeProjects";
import SlideShow from "@/components/dashboard/home/SlideShow";
import CardList from "@/components/dashboard/home/CardList";
import NewsLetterSection from "@/components/dashboard/home/NewsLetterSection";
import CardListSkeleton from "@/components/skeletons/CardListSkeleton";
import type { CardDataType } from "@/types/dashboard/home";

const Home = () => {
  // Styles
  const {classes} = useStyles();

  // Data fetching function
  const UsersFetcher = (url: string) => {
    return axios(url).then((res) => res.data);
  };

  // Fetch data with SWR
  const { data, error, isLoading } = useSWR(HOME_CARDS_API_URI, UsersFetcher);

  return (
    <Box className={classes.root}>
      <GridContainer>
        <SingleGrid span={4}>
          <SlideShow images={slideShowImages} height={328} width="100%" />
          {isLoading ? (
            // Loading skeletons
            <>
              <CardListSkeleton />
              <CardListSkeleton />
              <CardListSkeleton />
            </>
          ) : (
            // Render card sections
            data.map((cardSection: CardDataType) => (
              <CardList
                title={cardSection.title}
                cards={cardSection.cards}
                buttons={cardSection.buttons}
                key={v4()}
              />
            ))
          )}
          <NewsLetterSection />
        </SingleGrid>
      </GridContainer>
    </Box>
  );
};

const useStyles = makeStyles({ name: { Home } })(() => ({
  root: {
    marginTop: "100px",
  },
  media: {
    width: "100%",
    height: "100px",
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    objectFit: "cover",
  },
}));

export default Home;