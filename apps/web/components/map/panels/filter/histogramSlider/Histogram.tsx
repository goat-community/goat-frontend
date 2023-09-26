import React, { useState, useEffect } from 'react';
import { ClassNames } from '@emotion/react';

interface HistogramProps {
  data: number[];
  maxHeightPx?: number;
  value: [number, number];
  min: number;
  max: number;
  colors: {
    in: string;
    out: string;
  };
}

const Histogram: React.FC<HistogramProps> = ({
  data,
  maxHeightPx = 20,
  value,
  min,
  max,
  colors,
}) => {
  const [heightData, setHeightData] = useState<number[]>([]);
  const numOfColumn = data.length;

  useEffect(() => {
    const maxData = Math.max(...data);
    const heightPxPerUnit = maxHeightPx / maxData;
    const newHeightData = data.map((v) => Math.round(heightPxPerUnit * v));

    setHeightData(newHeightData);
  }, [data, maxHeightPx]);

  const [vMin, vMax] = value;
  const range = max - min;
  const start = ((vMin - min) * numOfColumn) / range;
  const end = start + ((vMax - vMin) * numOfColumn) / range;

  return (
    <ClassNames>
      {({ css }) => (
        <>
          <svg
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${numOfColumn} ${maxHeightPx}`}
          >
            <defs>
              <mask
                id={`${Date.now()}`}
                x="0"
                y="0"
                width={numOfColumn}
                height={maxHeightPx}
              >
                <rect
                  x={start}
                  y="0"
                  fill="white"
                  width={end - start}
                  height={maxHeightPx}
                />
              </mask>
              <mask
                id={`${Date.now() + 1}`}
                x="0"
                y="0"
                width={numOfColumn}
                height={maxHeightPx}
              >
                <rect x="0" y="0" fill="white" width={start} height={maxHeightPx} />
                <rect
                  x={start}
                  y="0"
                  fill="black"
                  width={end - start}
                  height={maxHeightPx}
                />
                <rect
                  x={end}
                  y="0"
                  fill="white"
                  width={numOfColumn - end}
                  height={maxHeightPx}
                />
              </mask>
            </defs>
            {heightData.map((height, index) => (
              <React.Fragment key={index}>
                <rect
                  mask={`url(#${Date.now() + 1})`}
                  x={index}
                  y={maxHeightPx - height}
                  width="1.2"
                  strokeWidth="0"
                  height={height}
                  fill={colors.out}
                />
                <rect
                  mask={`url(#${Date.now()})`}
                  x={index}
                  y={maxHeightPx - height}
                  width="1.2"
                  strokeWidth="0"
                  fill={colors.in}
                  height={height}
                />
              </React.Fragment>
            ))}
          </svg>
        </>
      )}
    </ClassNames>
  );
};

export default Histogram;