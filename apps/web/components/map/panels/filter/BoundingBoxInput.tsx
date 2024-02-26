import React, { useState, useEffect } from "react";
import { Box, TextField, useTheme, debounce } from "@mui/material";
import FormLabelHelper from "@/components/common/FormLabelHelper";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundset]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: theme.spacing(4) }}
    >
      <Box sx={{ display: "flex", gap: theme.spacing(3) }}>
        <Box sx={{ flexGrow: 1 }}>
          <FormLabelHelper label="North (lat)" color="inherit" />
          <TextField
            value={north}
            size="small"
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
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <FormLabelHelper label="West (lat)" color="inherit" />
          <TextField
            size="small"
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
      </Box>
      <Box sx={{ display: "flex", gap: theme.spacing(3) }}>
        <Box sx={{ flexGrow: 1 }}>
          <FormLabelHelper label="South (lat)" color="inherit" />
          <TextField
            size="small"
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
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <FormLabelHelper label="East (lon)" color="inherit" />
          <TextField
            size="small"
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
    </Box>
  );
};

export default BoundingBoxInput;
