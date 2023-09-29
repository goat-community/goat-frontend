import { ArrowPopper as JobStatusMenu } from "@/components/ArrowPoper";
import JobProgressItem from "@/components/jobs/JobProgressItem";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useState } from "react";

export default function JobsPopper() {
  const [open, setOpen] = useState(false);

  return (
    <JobStatusMenu
      content={
        <Paper
          sx={{
            width: "320px",
            overflow: "auto",
            pt: 4,
            pb: 2,
          }}
        >
          <Box>
            <Typography variant="body1" fontWeight="bold" sx={{ px: 4, py: 1 }}>
              Job Status
            </Typography>
            <Divider sx={{ mb: 0, pb: 0 }} />
          </Box>
          <Box sx={{ maxHeight: "300px", overflow: "auto", py: 2 }}>
            <Stack direction="column">
              {/* <JobProgressItem
                id="1"
                type="layer_upload"
                status="running"
                name="test.gpkg"
              />
              <Divider /> */}
{/* 
              <JobProgressItem
                id="1"
                type="layer_upload"
                status="failed"
                name="test.gpkg"
              />
              <Divider /> */}
              <JobProgressItem
                id="1"
                type="layer_upload"
                status="finished"
                name="test.gpkg"
              />
              {/* <Divider />
              <JobProgressItem
                id="1"
                type="layer_upload"
                status="pending"
                name="test.gpkg"
              /> */}
            </Stack>
          </Box>
          <Divider sx={{ mt: 0 }} />
          <Stack
            direction="row"
            justifyContent="end"
            alignItems="center"
            sx={{ py: 1 }}
          >
            <Button
              variant="text"
              sx={{
                mr: 4,
              }}
            >
              <Typography variant="body2" fontWeight="bold" color="inherit">
                Clear all
              </Typography>
            </Button>
          </Stack>
        </Paper>
      }
      open={open}
      placement="bottom"
      onClose={() => setOpen(false)}
    >
      <IconButton
        onClick={() => {
          setOpen(!open);
        }}
        size="small"
        sx={{
          ...(open && {
            color: "primary.main",
          }),
        }}
      >
        <Icon
          fontSize="inherit"
          iconName={ICON_NAME.BARS_PROGRESS}
          htmlColor="inherit"
        />
      </IconButton>
    </JobStatusMenu>
  );
}
