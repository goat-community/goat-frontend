"use client";

import {
  useTheme,
  Box,
  Avatar,
  Stack,
  Typography,
  Divider,
  Skeleton,
} from "@mui/material";
import { useTranslation } from "@/i18n/client";
import { LoadingButton } from "@mui/lab";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useAppSubscription } from "@/lib/api/subscription";

const Subscription = () => {
  const theme = useTheme();
  const { t } = useTranslation(["dashboard", "common"]);

  const { subscription, isLoading } = useAppSubscription();
  return (
    <>
      {isLoading ? (
        <Skeleton variant="rectangular" height={300} />
      ) : (
        <Box sx={{ p: 4 }}>
          <Stack spacing={theme.spacing(6)}>
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {t("app_subscription")}
              </Typography>
              <Typography variant="caption">
                {t("app_subscription_description")}
              </Typography>
            </Box>
            <Divider />
          </Stack>
          {subscription &&
            subscription.map((item) => {
              return (
                <Box key={item.id}>
                  <Stack
                    direction="row"
                    spacing={4}
                    alignItems="center"
                    sx={{ mt: 6 }}
                  >
                    <Avatar
                      src={item.avatar_url}
                      sx={{ width: 50, height: 50 }}
                      alt={item.subscription_type}
                    />
                    <Typography fontWeight="bold" variant="h6">
                      {t(
                        `dashboard:app_subscription_${item.subscription_type}`,
                      )}
                    </Typography>
                  </Stack>
                  <Stack
                    justifyContent="space-between"
                    direction="row"
                    alignItems="center"
                  >
                    <Stack spacing={2} sx={{ mt: 4 }}>
                      <Typography variant="body2">
                        {t("dashboard:app_subscription_seats_available", {
                          available_seats: item.assigned_seat,
                          total_seats: item.seat,
                        })}
                      </Typography>
                      <Typography variant="body2">
                        {t("dashboard:app_subscription_next_payment", {
                          date: item.end_date,
                        })}
                      </Typography>
                    </Stack>
                    {subscription && subscription && (
                      <Stack spacing={4}>
                        <LoadingButton
                          variant="contained"
                          startIcon={
                            <Icon fontSize="small" iconName={ICON_NAME.EDIT} />
                          }
                          aria-label="manage-subscription"
                          name="manage-subscription"
                        >
                          {t("dashboard:app_subscription_manage")}
                        </LoadingButton>
                        <LoadingButton
                          variant="outlined"
                          startIcon={
                            <Icon fontSize="small" iconName={ICON_NAME.TRASH} />
                          }
                          aria-label="cancel-subscription"
                          name="cancel-subscription"
                          color="error"
                        >
                          {t("dashboard:app_subscription_cancel")}
                        </LoadingButton>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              );
            })}
          {subscription && subscription.length === 0 && (
            <Stack
              direction="column"
              spacing={4}
              sx={{
                mt: 10,
                mb: 5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography variant="h6" color={theme.palette.text.secondary}>
                {t("app_subscription_not_available")}
              </Typography>
            </Stack>
          )}
        </Box>
      )}
    </>
  );
};

export default Subscription;
