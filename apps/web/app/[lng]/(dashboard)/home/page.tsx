"use client";

import React from "react";
import axios from "axios";
// import { v4 } from "uuid";
import useSWR from "swr";

import GridContainer from "@/components/grid/GridContainer";
import SingleGrid from "@/components/grid/SingleGrid";
import { HOME_CARDS_API_URI } from "@/lib/api/apiConstants";
// import { slideShowImages } from "@/public/assets/data/homeProjects";
// import SlideShow from "@/components/dashboard/home/SlideShow";
// import CardList from "@/components/dashboard/home/CardList";
// import CardListSkeleton from "@/components/skeletons/CardListSkeleton";
// import type { CardDataType } from "@/types/dashboard/home";
import { Box } from "@mui/material";

const Home = () => {
  // Data fetching function
  const UsersFetcher = (url: string) => {
    return axios(url).then((res) => res.data);
  };

  // Fetch data with SWR
  const { error: _error } = useSWR(HOME_CARDS_API_URI, UsersFetcher);

  return (
    <Box>
      <GridContainer>
        <SingleGrid span={4}>
          {/* <SlideShow images={slideShowImages} height={328} width="100%" />
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
          )} */}
        </SingleGrid>
      </GridContainer>
    </Box>
  );
};

export default Home;
