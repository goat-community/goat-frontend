"use client";

import "chart.js/auto";
import React from "react";
import { Bar } from "react-chartjs-2";
import { Box } from "@mui/material";

const Histogram = ({ data, highlight }) => {
  const trimData = data;
  trimData.pop();

  const handleClick = (_, i) => {
    console.log(i[0]._index);
  };
  const barData = {
    labels: trimData.map((_, i) => i),
    datasets: [
      {
        categoryPercentage: 1,
        barPercentage: 1,
        backgroundColor: trimData.map((_, i) =>
          i >= highlight[0] && i < highlight[1] ? "#dde7de" : "#C8CED5",
        ),
        hoverBackgroundColor: "#FCE1D3",
        data: trimData,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltips: { enabled: false },
    },
    scales: {
      x: {
        display: false,
      },
      y: { display: false },
    },
    onClick: handleClick,
  };
  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Bar data={barData} options={options} style={{height: "100px"}}/>
    </Box>
  );
};

Histogram.defaultProps = {
  data: {},
  highlight: [],
};

export default Histogram;
