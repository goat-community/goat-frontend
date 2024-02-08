import React, { useState, useEffect } from "react";
import { Box, TextField, useTheme, debounce } from "@mui/material";

interface BoundingProps {
  bounds: string;
  onChange: (value: string) => void;
}

const BoundingBoxInput = (props: BoundingProps) => {
  const { bounds, onChange } = props;

  const boundsArray = bounds.split(",").map((bound) => parseFloat(bound));
  const [boundset, setBoundset] = useState<string>(bounds);

  console.log(bounds, boundsArray);

  const theme = useTheme();

  const [north, setNorth] = useState<string>(
    boundsArray.length === 4 ? boundsArray[3].toString() : "",
  );
  const [south, setSouth] = useState<string>(
    boundsArray.length === 4 ? boundsArray[1].toString() : "",
  );
  const [east, setEast] = useState<string>(
    boundsArray.length === 4 ? boundsArray[2].toString() : "",
  );
  const [west, setWest] = useState<string>(
    boundsArray.length === 4 ? boundsArray[0].toString() : "",
  );

  function setBoundInPostion(value: number, position: number) {
    debounce(() => {
      const tempBounds = [...boundsArray];
      tempBounds[position] = value;
      setBoundset(tempBounds.join());
      onChange(tempBounds.join());
    }, 500)();
  }

  // const setBoundInPostion = useMemo(
  //   () =>
  //     debounce((value, position) => {
  //       console.log(bounds, boundsArray, value)
  //       const tempBounds = [...boundsArray];
  //       tempBounds[position] = value;
  //       // setBoundset(tempBounds.join());
  //       onChange(tempBounds.join());
  //       // search(
  //       //   "https://api.mapbox.com",
  //       //   "mapbox.places",
  //       //   MAPBOX_TOKEN,
  //       //   request.value,
  //       //   onresult,
  //       //   undefined,
  //       //   undefined,
  //       //   request.bbox,
  //       // );
  //     }, 400),
  //   [],
  // );

  useEffect(() => {
    console.log(bounds.split(","), boundset.split(","));
    if (bounds.split(",") === boundset.split(",")) {
      const newBoundsArray = bounds
        .split(",")
        .map((bound) => parseFloat(bound));
      setNorth(newBoundsArray.length === 4 ? newBoundsArray[3].toString() : "");
      setSouth(newBoundsArray.length === 4 ? newBoundsArray[1].toString() : "");
      setEast(newBoundsArray.length === 4 ? newBoundsArray[2].toString() : "");
      setWest(newBoundsArray.length === 4 ? newBoundsArray[0].toString() : "");
    }
  }, [boundset]);

  // useEffect(() => {
  //   const newBoundsArray = bounds.split(",").map((bound) => parseFloat(bound));
  //   setNorth(newBoundsArray.length === 4 ? newBoundsArray[3].toString() : "");
  //   setSouth(newBoundsArray.length === 4 ? newBoundsArray[1].toString() : "");
  //   setEast(newBoundsArray.length === 4 ? newBoundsArray[2].toString() : "");
  //   setWest(newBoundsArray.length === 4 ? newBoundsArray[0].toString() : "");
  // }, [bounds]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: theme.spacing(4) }}
    >
      <Box sx={{ display: "flex", gap: theme.spacing(3) }}>
        <TextField
          sx={{ flexGrow: 1 }}
          label="North (lat)"
          value={north}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            if (e.target.value === "") {
              setNorth("");
              setBoundInPostion(0, 3);
            } else {
              setNorth(e.target.value);
              setBoundInPostion(parseFloat(e.target.value), 3);
            }
          }}
        />
        <TextField
          sx={{ flexGrow: 1 }}
          label="West (lon)"
          value={west}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            if (e.target.value === "") {
              setWest("");
              setBoundInPostion(0, 0);
            } else {
              setWest(e.target.value);
              setBoundInPostion(parseFloat(e.target.value), 0);
            }
          }}
        />
      </Box>
      <Box sx={{ display: "flex", gap: theme.spacing(3) }}>
        <TextField
          sx={{ flexGrow: 1 }}
          label="South (lat)"
          value={south}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            if (e.target.value === "") {
              setSouth("");
              setBoundInPostion(0, 1);
            } else {
              setSouth(e.target.value);
              setBoundInPostion(parseFloat(e.target.value), 1);
            }
          }}
        />
        <TextField
          sx={{ flexGrow: 1 }}
          label="East (lon)"
          value={east}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            if (e.target.value === "") {
              setEast("");
              setBoundInPostion(0, 2);
            } else {
              setEast(e.target.value);
              setBoundInPostion(parseFloat(e.target.value), 2);
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default BoundingBoxInput;
