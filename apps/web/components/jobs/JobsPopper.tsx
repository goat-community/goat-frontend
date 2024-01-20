import { ArrowPopper as JobStatusMenu } from "@/components/ArrowPoper";
import JobProgressItem from "@/components/jobs/JobProgressItem";
import { setJobsReadStatus, useJobs } from "@/lib/api/jobs";
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
import { useEffect, useState } from "react";

export default function JobsPopper() {
  const [open, setOpen] = useState(false);
  const { jobs, mutate } = useJobs({
    read: false,
  });

  const [intervalId, setIntervalId] = useState<number | null>(null);
  useEffect(() => {
    if (!jobs?.items) return;
    const runningJobs = jobs.items.length;
    if (runningJobs === 0) {
      // no running jobs, clear interval and return
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      return;
    }

    // at least one running job, set interval if not already set
    if (!intervalId) {
      const id = setInterval(() => {
        mutate();
      }, 5000) as unknown as number;
      setIntervalId(id);
    }

    // cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs?.items, intervalId]);

  const [isBusy, setIsBusy] = useState(false);

  const handleClearAll = async () => {
    const jobIds = jobs?.items?.map((job) => job.id);
    if (!jobIds) return;
    setIsBusy(true);
    try {
      await setJobsReadStatus(jobIds);
      mutate();
    } catch (err) {
      console.error(err);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <>
      {jobs?.items && jobs.items.length > 0 && (
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
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ px: 4, py: 1 }}
                >
                  Job status
                </Typography>
                <Divider sx={{ mb: 0, pb: 0 }} />
              </Box>
              <Box
                sx={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  py: 2,
                }}
              >
                <Stack direction="column">
                  {jobs?.items?.map((job, index) => (
                    <Box key={job.id}>
                      <JobProgressItem
                        id={job.id}
                        type={job.type}
                        status={job.status_simple}
                        name={job.id}
                      />
                      {index < jobs.items.length - 1 && <Divider />}
                    </Box>
                  ))}
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
                  disabled={isBusy}
                  variant="text"
                  onClick={handleClearAll}
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
          {jobs?.items && jobs.items.length > 0 ? (
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
          ) : (
            <></>
          )}
        </JobStatusMenu>
      )}
    </>
  );
}
