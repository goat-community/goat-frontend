import React, { useState } from "react";
import sample from "./sample2.json";
import RangeSlider from "./RangeSlider";
import Histogram from "./Histogram";
// import RangeInput from "./RangeInput";
import { Box } from "@mui/material";

interface HistogramSlider {
  countData: number[];
}

function HistogramSlider(props: HistogramSlider) {
  const { countData } = props;
  const responseData = sample.range;
  const maxData = sample.max;
  const priceData: number[] = [];

  for (let i = 0; i < responseData.length; i += 1) {
    const thisPrice = responseData[i].from ? responseData[i].from : 0;
    // const thisCount = responseData[i].doc_count;
    // countData.push(thisCount || 0);
    priceData.push(thisPrice || 0);
  }
  // countData[countData.length] = countData[countData.length - 1];
  priceData[priceData.length] = maxData;

  const range = [0, countData.length - 1];
  const domain = range;
  const defaultInputValue = [
    Number(priceData[0]),
    Number(priceData[priceData.length - 1]),
  ];
  // console.log(countData.length);
  const [updateValue, setUpdateValue] = useState(domain);
  const [_, setInputValue] = useState<number[]>(defaultInputValue);
  const onUpdateCallBack = (v: number[]) => {
    setUpdateValue(v);
    setInputValue([Number(priceData[v[0]]), Number(priceData[v[1]])]);
  };
  const onChangeCallBack = (v) => {
    setUpdateValue(v);
    setInputValue([Number(priceData[v[0]]), Number(priceData[v[1]])]);
  };

  console.log(countData);

  return (
    <Box
      sx={{
        padding: "15px",
      }}
    >
      <Histogram data={countData} highlight={updateValue} />
      <RangeSlider
        values={updateValue}
        mode={2}
        step={1}
        domain={domain}
        onChange={onChangeCallBack}
        onUpdate={onUpdateCallBack}
      />
    </Box>
  );
}

export default HistogramSlider;
