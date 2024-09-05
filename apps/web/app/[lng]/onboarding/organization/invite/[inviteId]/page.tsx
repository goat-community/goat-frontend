"use client";

import { LoadingButton } from "@mui/lab";
import { Alert, Avatar, Box, Link, Stack, Typography, useTheme } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import AuthContainer from "@p4b/ui/components/AuthContainer";
import AuthLayout from "@p4b/ui/components/AuthLayout";
import { Loading } from "@p4b/ui/components/Loading";

import { useTranslation } from "@/i18n/client";

import { acceptInvitation, declineInvitation, useInvitations } from "@/lib/api/users";
import { createRegistrationUrl } from "@/lib/utils/auth";
import type { GetInvitationsQueryParams } from "@/lib/validations/user";

import type { ResponseResult } from "@/types/common";

export default function OrganizationInviteJoin({ params: { inviteId } }) {
  const theme = useTheme();
  const { t } = useTranslation("common");
  const [queryParams, _setQueryParams] = useState<GetInvitationsQueryParams>({
    type: "organization",
    invitation_id: inviteId,
  });
  const { invitations, isLoading: isInvitationLoading, isError } = useInvitations(queryParams);
  const { status, data: session, update } = useSession();
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);
  const [responseResult, setResponseResult] = useState<ResponseResult>({
    message: "",
    status: undefined,
  });
  const isLoading = useMemo(() => isInvitationLoading, [isInvitationLoading]);

  const invitation = useMemo(() => {
    if (
      invitations?.items &&
      invitations?.items?.length > 0 &&
      invitations?.items?.[0].payload?.user_email === session?.user?.email
    )
      return invitations?.items?.[0];
  }, [invitations, session]);

  useEffect(() => {
    if (!invitations && !isLoading && !isError) return;
    if (invitations?.items?.length === 0 || isError) {
      const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/keycloak`;
      signOut({ redirect: false });
      const registrationUrl = createRegistrationUrl(redirectUrl as string);
      router.replace(registrationUrl);
    }
  }, [invitations, isLoading, router, isError]);

  async function handleAcceptInvite() {
    setIsBusy(true);
    try {
      await acceptInvitation(inviteId);
    } catch (_error) {
      setResponseResult({
        message: t("invite_accept_error"),
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
        message: t("invite_decline_error"),
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
                      {`${t("invite_organization_message")}: `}
                      <b>{invitation?.payload?.name}</b>
                    </Typography>
                    <Avatar
                      sx={{ width: 50, height: 50 }}
                      alt={invitation?.payload?.avatar || "Org"}
                      src={invitation?.payload?.avatar}
                    />
                  </Stack>
                )}
                {!invitation && <Typography variant="h5">{t("we_are_sorry")}</Typography>}
              </>
            }
            headerAlert={
              responseResult.status && (
                <Alert severity={responseResult.status}>{responseResult.message}</Alert>
              )
            }
            body={
              <>
                {!invitation && <Typography variant="body1">{t("invite_not_found_message")}</Typography>}
                {invitation && invitation.status == "pending" && (
                  <Typography variant="body1">{t("invite_join_organization_description")}</Typography>
                )}
              </>
            }
            footer={
              <>
                <Box
                  sx={{
                    mt: theme.spacing(6),
                  }}>
                  {!invitation && (
                    <Link id="backToApplication" href="/">
                      « {t("back_to_application")}
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
                        }}>
                        {t("accept")}
                      </LoadingButton>
                      <LoadingButton
                        fullWidth
                        disabled={isBusy}
                        onClick={handleDeclineInvite}
                        variant="text"
                        sx={{
                          color: theme.palette.error.main,
                        }}>
                        {t("decline")}
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
