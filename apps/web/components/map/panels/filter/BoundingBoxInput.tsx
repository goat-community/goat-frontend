import React from 'react'
import { Box, TextField, useTheme } from '@mui/material'

interface BoundingProps {
  bounds: string;
}

const BoundingBoxInput = (props: BoundingProps) => {
  const {bounds} = props;

  const theme = useTheme();
  console.log(bounds)
  return (
    <Box sx={{display: "flex", flexDirection: "column", gap: theme.spacing(4)}}>
      <Box sx={{display: "flex", gap: theme.spacing(3)}}>
        <TextField
          sx={{flexGrow: 1}}
          label="North (lon)"
          value={11.435354}
        />
        <TextField 
          sx={{flexGrow: 1}}
          label="West (lat)"
          value={11.435354}
        />
      </Box>
      <Box sx={{display: "flex", gap: theme.spacing(3)}}>
        <TextField 
          sx={{flexGrow: 1}}
          label="South (lon)"
          value={11.435354}
        />
        <TextField 
          sx={{flexGrow: 1}}
          label="East (lat)"
          value={11.435354}
        />
      </Box>
    </Box>
  )
}

export default BoundingBoxInput
