import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";

import { useTranslation } from "@/i18n/client";

import { setJobsReadStatus, useJobs } from "@/lib/api/jobs";

import { ArrowPopper as JobStatusMenu } from "@/components/ArrowPoper";
import JobProgressItem from "@/components/jobs/JobProgressItem";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export default function JobsPopper() {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const { jobs, mutate } = useJobs({
    read: false,
  });

  const runningJobs = useMemo(() => {
    return jobs?.items?.filter((job) => job.status_simple === "running");
  }, [jobs?.items]);

  const [intervalId, setIntervalId] = useState<number | null>(null);
  useEffect(() => {
    if (!runningJobs) return;
    const runningJobsCount = runningJobs.length;
    if (runningJobsCount === 0) {
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
  }, [runningJobs, intervalId]);

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
              }}>
              <Box>
                <Typography variant="body1" fontWeight="bold" sx={{ px: 4, py: 1 }}>
                  {t("job_status")}
                </Typography>
                <Divider sx={{ mb: 0, pb: 0 }} />
              </Box>
              <Box
                sx={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  py: 2,
                }}>
                <Stack direction="column">
                  {jobs?.items?.map((job, index) => (
                    <Box key={job.id}>
                      <JobProgressItem
                        id={job.id}
                        type={job.type}
                        status={job.status_simple}
                        name={job.id}
                        date={job.updated_at}
                        errorMessage={job.status_simple === "failed" ? job.msg_simple : undefined}
                      />
                      {index < jobs.items.length - 1 && <Divider />}
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Divider sx={{ mt: 0 }} />
              <Stack direction="row" justifyContent="end" alignItems="center" sx={{ py: 1 }}>
                <Button
                  disabled={isBusy}
                  variant="text"
                  onClick={handleClearAll}
                  sx={{
                    mr: 4,
                  }}>
                  <Typography variant="body2" fontWeight="bold" color="inherit">
                    {t("clear_all")}
                  </Typography>
                </Button>
              </Stack>
            </Paper>
          }
          open={open}
          placement="bottom"
          onClose={() => setOpen(false)}>
          {jobs?.items && jobs.items.length > 0 ? (
            <Tooltip title={t("job_status")}>
              <IconButton
                onClick={() => {
                  setOpen(!open);
                }}
                size="small"
                sx={{
                  ...(open && {
                    color: "primary.main",
                  }),
                }}>
                {runningJobs && runningJobs?.length > 0 && (
                  <StyledBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot">
                    <Icon fontSize="inherit" iconName={ICON_NAME.BARS_PROGRESS} htmlColor="inherit" />
                  </StyledBadge>
                )}
                {!runningJobs ||
                  (runningJobs?.length === 0 && (
                    <Icon fontSize="inherit" iconName={ICON_NAME.BARS_PROGRESS} htmlColor="inherit" />
                  ))}
              </IconButton>
            </Tooltip>
          ) : (
            <></>
          )}
        </JobStatusMenu>
      )}
    </>
  );
}
