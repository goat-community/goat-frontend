"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Divider,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { useTranslation } from "@/i18n/client";
import { Trans } from "react-i18next";
import type { UserUpdate } from "@/lib/validations/user";
import { userSchemaUpdate } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import {
  deleteAccount,
  updateUserProfile,
  useUserProfile,
} from "@/lib/api/users";
import { RhfAvatar } from "@/components/common/form-inputs/AvatarUpload";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/modals/Confirm";
import { signOut } from "next-auth/react";

const Profile = () => {
  const theme = useTheme();
  const { t } = useTranslation(["dashboard", "common"]);
  const { userProfile, isLoading } = useUserProfile();
  const [isProfileUpdateBusy, setIsProfileUpdateBusy] =
    useState<boolean>(false);
  const [isDeleteAccountBusy, setIsDeleteAccountBusy] =
    useState<boolean>(false);
  const [confirmLogoutDialogOpen, setConfirmLogoutDialogOpen] = useState(false);
  const [confirmDeleteAccountDialogOpen, setConfirmDeleteAccountDialogOpen] =
    useState(false);
  const {
    register: registerUserProfile,
    handleSubmit: handleUserProfileSubmit,
    formState: { errors, isDirty, isValid },
    getValues,
    control,
    reset,
  } = useForm<UserUpdate>({
    mode: "onChange",
    resolver: zodResolver(userSchemaUpdate),
    defaultValues: useMemo(() => {
      if (userProfile) {
        return userSchemaUpdate.parse(userProfile);
      }
      return {};
    }, [userProfile]),
  });

  useEffect(() => {
    if (userProfile) {
      reset(userSchemaUpdate.parse(userProfile));
    }
  }, [userProfile, reset]);

  async function _updateUserProfile(data: UserUpdate) {
    setIsProfileUpdateBusy(true);
    try {
      await updateUserProfile(data);
      toast.success("Profile updated");
      reset({}, { keepValues: true });
    } catch (_error) {
      toast.error("Error updating profile");
    } finally {
      setIsProfileUpdateBusy(false);
    }
  }

  async function _deleteAccount() {
    setIsDeleteAccountBusy(true);
    try {
      await deleteAccount();
      toast.success("Account deleted");
      reset({}, { keepValues: true });
    } catch (_error) {
      toast.error("Error deleting account");
    } finally {
      setIsDeleteAccountBusy(false);
    }
  }

  async function onUserProfileSubmit(data: UserUpdate) {
    if (data.email !== userProfile?.email) {
      setConfirmLogoutDialogOpen(true);
      return;
    }
    await _updateUserProfile(data);
  }
  return (
    <Box sx={{ p: 4 }}>
      <Box
        component="form"
        onSubmit={handleUserProfileSubmit(onUserProfileSubmit)}
      >
        <Stack spacing={theme.spacing(6)}>
          <Divider />
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {t("personal_information")}
            </Typography>
            <Typography variant="caption">
              {t("update_personal_information")}
            </Typography>
          </Box>
          <Divider />

          {/* Email Change Confirmation */}
          <ConfirmModal
            open={confirmLogoutDialogOpen}
            title="Email Change Confirmation"
            body="This action will log you out of the system. Are you sure you want to continue? You will have to login again with your new email."
            onClose={() => {
              setConfirmLogoutDialogOpen(false);
            }}
            onConfirm={async () => {
              setConfirmLogoutDialogOpen(false);
              const data = getValues();
              await _updateUserProfile(data);
              signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL });
            }}
          />

          {isLoading ? (
            <>
              <Skeleton variant="circular" width={64} height={64} />
              <Skeleton variant="rectangular" height={300} />
            </>
          ) : (
            <>
              <RhfAvatar
                name="avatar"
                control={control}
                title={t("user_avatar")}
                avatar={userProfile?.avatar ?? ""}
              />

              <TextField
                required
                helperText={errors.first_name ? errors.first_name?.message : ""}
                label="First Name"
                id="name"
                {...registerUserProfile("first_name")}
                error={errors.first_name ? true : false}
              />

              <TextField
                required
                helperText={errors.last_name ? errors.last_name?.message : ""}
                label="Last Name"
                id="name"
                {...registerUserProfile("last_name")}
                error={errors.last_name ? true : false}
              />

              <TextField
                required
                helperText={
                  errors.email
                    ? errors.email?.message
                    : "You have to logout in order to reflect changes for email."
                }
                label="Email"
                id="name"
                {...registerUserProfile("email")}
                error={errors.email ? true : false}
              />
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <LoadingButton
                  loading={isProfileUpdateBusy}
                  variant="contained"
                  startIcon={
                    <Icon fontSize="small" iconName={ICON_NAME.SAVE} />
                  }
                  aria-label="update-profile"
                  name="update-profile"
                  disabled={isProfileUpdateBusy || !isDirty || !isValid}
                  type="submit"
                >
                  Update
                </LoadingButton>
              </Stack>
            </>
          )}
        </Stack>
      </Box>

      <Box sx={{ mt: 16 }}>
        <Stack spacing={theme.spacing(6)}>
          <Divider />

          {/* Delete Account Confirmation */}
          <ConfirmModal
            open={confirmDeleteAccountDialogOpen}
            title={t("dashboard:delete_account")}
            body={
              <Trans
                i18nKey="dashboard:delete_account_confirmation_body"
                values={{ email: userProfile?.email }}
                components={{ b: <b />, ul: <ul />, li: <li /> }}
              />
            }
            onClose={() => {
              setConfirmDeleteAccountDialogOpen(false);
            }}
            onConfirm={async () => {
              setConfirmDeleteAccountDialogOpen(false);
              await _deleteAccount();
              signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL });
            }}
            closeText={t("common:close")}
            confirmText={t("common:delete")}
            matchText={userProfile?.email}
          />

          <Box>
            <Typography
              variant="body1"
              fontWeight="bold"
              color={theme.palette.error.main}
            >
              {t("dashboard:danger_zone")}
            </Typography>
            <Typography variant="caption">
              {t("dashboard:danger_zone_account_description")}
            </Typography>
          </Box>
          <Divider />
          <Stack>
            <Typography variant="body1">
              <Trans
                i18nKey="dashboard:danger_zone_account_body"
                components={{ b: <b /> }}
              />
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <LoadingButton
              size="large"
              startIcon={<Icon fontSize="small" iconName={ICON_NAME.TRASH} />}
              variant="outlined"
              color="error"
              aria-label="delete-account"
              name="delete-account"
              loading={isDeleteAccountBusy}
              onClick={() => {
                setConfirmDeleteAccountDialogOpen(true);
              }}
              disabled={isProfileUpdateBusy}
            >
              <Typography variant="body1" fontWeight="bold" color="inherit">
                {t("dashboard:delete_account")}
              </Typography>
            </LoadingButton>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Profile;
