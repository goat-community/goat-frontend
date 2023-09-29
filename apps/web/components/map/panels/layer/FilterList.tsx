import React from "react";
import { Chip, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { v4 } from "uuid";

import "swiper/css";
import "swiper/css/pagination";

interface FilterListProps {
  chips: string[];
  setActiveFilter: (value: string) => void;
  activeFilter: string;
}

const FilterList = (props: FilterListProps) => {
  const { chips, setActiveFilter, activeFilter } = props;

  const theme = useTheme();

  function handleDelete() {
    setActiveFilter("none");
  }

  return (
    <>
      <Swiper
        slidesPerView="auto"
        spaceBetween={10}
        pagination={{
          clickable: true,
        }}
        style={{ margin: "0" }}
      >
        {chips.map((filter) => (
          <SwiperSlide key={v4()} style={{ width: "fit-content" }}>
            <Chip
              label={filter}
              onClick={() => setActiveFilter(filter)}
              variant={activeFilter === filter ? undefined : "outlined"}
              sx={{ paddingX: theme.spacing(2) }}
              onDelete={activeFilter === filter ? handleDelete : undefined}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default FilterList;
