import { useAppDispatch, useAppSelector } from "@/hooks/store/ContextHooks";
import { useTranslation } from "@/i18n/client";
import { useJobs } from "@/lib/api/jobs";
import { setRunningJobIds } from "@/lib/store/jobs/slice";
import { useEffect } from "react";

import { toast } from "react-toastify";

export function useJobStatus(onSuccess?: () => void, onFailed?: () => void) {
  const { jobs } = useJobs({
    read: false,
  });
  const runningJobIds = useAppSelector((state) => state.jobs.runningJobIds);
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");

  useEffect(() => {
    if (runningJobIds.length > 0) {
      jobs?.items?.forEach((job) => {
        if (runningJobIds.includes(job.id)) {
          if (job.status_simple === "running") return;
          dispatch(
            setRunningJobIds(runningJobIds.filter((id) => id !== job.id)),
          );
          const type = t(job.type) || "";
          if (job.status_simple === "finished") {
            onSuccess && onSuccess();
            toast.success(`"${type}" ${t("job_success")}`);
          } else {
            onFailed && onFailed();
            toast.error(`"${type}" ${t("job_failed")}`);
          }
        }
      });
    }
  }, [runningJobIds, jobs, dispatch, t, onSuccess, onFailed]);
}
