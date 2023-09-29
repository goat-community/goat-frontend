import type { JobStatusType, JobType } from "@/lib/validations/jobs";
import {
  Box,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";

interface JobProgressItemProps {
  id: string;
  type: JobType;
  status: JobStatusType;
  name: string;
}

const statusIcons: Record<JobStatusType, ICON_NAME> = {
  running: ICON_NAME.CLOSE,
  finished: ICON_NAME.CIRCLECHECK,
  pending: ICON_NAME.CLOCK,
  failed: ICON_NAME.CIRCLEINFO,
};

export default function JobProgressItem(props: JobProgressItemProps) {
  const theme = useTheme();
  const { type, status, name } = props;

  const statusColors: Record<JobStatusType, string> = {
    running: theme.palette.primary.main,
    finished: theme.palette.success.main,
    pending: theme.palette.grey[500],
    failed: theme.palette.error.main,
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        width: "100%",
        pl: 4,
        pr: 2,
        py: 1,
      }}
      aria-label={name}
      role="job_item"
    >
      <Box flexGrow={1} flexShrink={1} flexBasis="100%" sx={{ mr: 2 }}>
        <Stack spacing={2}>
          <Box textOverflow="ellipsis" overflow="hidden">
            <Typography variant="body2" fontWeight="bold" noWrap>
              {type} - {name}
            </Typography>
          </Box>
          <LinearProgress
            {...(status === "failed" || status === "finished"
              ? { variant: "determinate", value: 100 }
              : {})}
            sx={{
              width: "100%",
              ...(status === "pending" && {
                backgroundColor: theme.palette.grey[300],
              }),
              "& .MuiLinearProgress-bar": {
                backgroundColor: statusColors[status],
              },
            }}
          />
          <Typography variant="caption" fontWeight="bold">
            {
              {
                running: "Running",
                finished: "Finished successfully",
                pending: "Pending",
                failed: "Failed",
              }[status]
            }
          </Typography>
        </Stack>
      </Box>
      <IconButton
        size="small"
        disabled={status === "pending" || status === "running"}
        sx={{
          fontSize: "1.2rem",
          color: statusColors[status],
        }}
      >
        <Icon
          iconName={statusIcons[status]}
          htmlColor="inherit"
          fontSize="inherit"
        />
      </IconButton>
    </Box>
  );
}
