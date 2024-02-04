import React from 'react'
import { Box, TextField, useTheme } from '@mui/material'

interface BoundingProps {
  bounds: string;
}

const BoundingBoxInput = (props: BoundingProps) => {
  const {bounds} = props;

  console.log(bounds);
  const theme = useTheme();
  const boundsArray = bounds.split(',');
  return (
    <Box sx={{display: "flex", flexDirection: "column", gap: theme.spacing(4)}}>
      <Box sx={{display: "flex", gap: theme.spacing(3)}}>
        <TextField
          sx={{flexGrow: 1}}
          label="North (lat)"
          value={boundsArray[3]}
        />
        <TextField 
          sx={{flexGrow: 1}}
          label="West (lon)"
          value={boundsArray[0]}
        />
      </Box>
      <Box sx={{display: "flex", gap: theme.spacing(3)}}>
        <TextField 
          sx={{flexGrow: 1}}
          label="South (lat)"
          value={boundsArray[1]}
        />
        <TextField 
          sx={{flexGrow: 1}}
          label="East (lon)"
          value={boundsArray[2]}
        />
      </Box>
    </Box>
  )
}

export default BoundingBoxInput
