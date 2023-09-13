import React from 'react'
import { Skeleton, Box } from "@mui/material";

const CardListSkeleton = () => {
  return (
    <Box sx={{marginBottom: "40px"}}>
      <Skeleton variant="text" sx={{ fontSize: '2rem', marginBottom: "24px" }} />
      <Box sx={{display: "flex", gap: "24px"}}>
        <Skeleton variant="rounded" width={268} height={251} />
        <Skeleton variant="rounded" width={268} height={251} />
        <Skeleton variant="rounded" width={268} height={251} />
        <Skeleton variant="rounded" width={268} height={251} />
      </Box>
    </Box>
  )
}

export default CardListSkeleton
