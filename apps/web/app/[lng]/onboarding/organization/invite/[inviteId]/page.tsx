"use client";
import {
  Alert,
  Avatar,
  Box,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import AuthContainer from "@p4b/ui/components/AuthContainer";
import AuthLayout from "@p4b/ui/components/AuthLayout";
import { useSession } from "next-auth/react";
// import { useTranslation } from "@/i18n/client";
import { useRouter } from "next/navigation";

import {
  acceptInvitation,
  declineInvitation,
  useInvitations,
} from "@/lib/api/users";
import type { GetInvitationsQueryParams } from "@/lib/validations/user";
import { Loading } from "@p4b/ui/components/Loading";
import type { ResponseResult } from "@/types/common";
import { useTranslation } from "@/i18n/client";
import { LoadingButton } from "@mui/lab";

export default function OrganizationInviteJoin({ params: { inviteId } }) {
  const theme = useTheme();
  const [queryParams, _setQueryParams] = useState<GetInvitationsQueryParams>({
    type: "organization",
    invitation_id: inviteId,
  });
  const { invitations, isLoading } = useInvitations(queryParams);
  console.log(invitations);
  const { status, data: session, update } = useSession();
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);
  const { t } = useTranslation(["onboarding", "common"]);
  const [responseResult, setResponseResult] = useState<ResponseResult>({
    message: "",
    status: undefined,
  });

  const invitation = useMemo(() => {
    if (
      invitations?.items &&
      invitations?.items?.length > 0 &&
      invitations?.items?.[0].payload?.user_email === session?.user?.email
    )
      return invitations?.items?.[0];
  }, [invitations, session]);

  async function handleAcceptInvite() {
    setIsBusy(true);
    try {
      await acceptInvitation(inviteId);
    } catch (_error) {
      setResponseResult({
        message: t("onboarding:invite_accept_error"),
        status: "error",
      });
    } finally {
      setIsBusy(false);
    }
    update();
    router.push("/");
  }

  async function handleDeclineInvite() {
    setIsBusy(true);
    try {
      await declineInvitation(inviteId);
    } catch (_error) {
      setResponseResult({
        message: t("onboarding:invite_decline_error"),
        status: "error",
      });
    } finally {
      setIsBusy(false);
    }
    update();
    router.push("/");
  }

  return (
    <AuthLayout>
      <>
        {status == "authenticated" && !isLoading && (
          <AuthContainer
            headerTitle={
              <>
                {invitation?.payload?.name && (
                  <Stack spacing={4} alignItems="center">
                    <Typography variant="h5">
                      You have been invited to join the organization{": "}
                      <b>{invitation?.payload?.name}</b>
                    </Typography>
                    <Avatar
                      sx={{ width: 50, height: 50 }}
                      alt={invitation?.payload?.avatar || "Org"}
                      src={invitation?.payload?.avatar}
                    />
                  </Stack>
                )}
                {!invitation && (
                  <Typography variant="h5">We are sorry...</Typography>
                )}
              </>
            }
            headerAlert={
              responseResult.status && (
                <Alert severity={responseResult.status}>
                  {responseResult.message}
                </Alert>
              )
            }
            body={
              <>
                {!invitation && (
                  <Typography variant="body1">
                    We could not find the invitation you are looking for. Please
                    try with a valid invitation link or another account.
                  </Typography>
                )}
                {invitation && invitation.status == "pending" && (
                  <Typography variant="body1">
                    Please confirm your invitation to join the organization by
                    clicking the button below.
                  </Typography>
                )}
              </>
            }
            footer={
              <>
                <Box
                  sx={{
                    mt: theme.spacing(6),
                  }}
                >
                  {!invitation && (
                    <Link id="backToApplication" href="/">
                      « Back to Application
                    </Link>
                  )}
                  {invitation && (
                    <>
                      <LoadingButton
                        loading={isBusy}
                        variant="contained"
                        fullWidth
                        disabled={isBusy}
                        onClick={handleAcceptInvite}
                        sx={{
                          mb: theme.spacing(2),
                        }}
                      >
                        Join
                      </LoadingButton>
                      <LoadingButton
                        fullWidth
                        disabled={isBusy}
                        onClick={handleDeclineInvite}
                        variant="text"
                        sx={{
                          color: theme.palette.error.main,
                        }}
                      >
                        Decline
                      </LoadingButton>
                    </>
                  )}
                </Box>
              </>
            }
          />
        )}
        {isLoading && <Loading />}
      </>
    </AuthLayout>
  );
}
