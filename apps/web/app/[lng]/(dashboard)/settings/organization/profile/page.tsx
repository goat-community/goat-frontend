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
import type { OrganizationUpdate } from "@/lib/validations/organization";
import { organizationUpdateSchema } from "@/lib/validations/organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { RhfAvatar } from "@/components/common/form-inputs/AvatarUpload";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/modals/Confirm";
import { signOut } from "next-auth/react";
import { useOrganization } from "@/lib/api/users";
import {
  deleteOrganization,
  updateOrganization,
} from "@/lib/api/organizations";
import Cookies from "js-cookie";

const OrganizationProfile = () => {
  const theme = useTheme();
  const { t } = useTranslation("common");
  const {
    organization,
    mutate: mutateOrganization,
    isLoading,
  } = useOrganization();
  const [isOrganizationUpdateBusy, setIsOrganizationUpdateBusy] =
    useState<boolean>(false);
  const [isDeleteOrganizationBusy, setIsDeleteOrganizationBusy] =
    useState<boolean>(false);
  const [
    confirmDeleteOrganizationDialogOpen,
    setConfirmDeleteOrganizationDialogOpen,
  ] = useState(false);
  const {
    register: registerOrganizationUpdate,
    handleSubmit: handleOrganizationUpdateSubmit,
    formState: { errors, isDirty, isValid },
    control,
    reset,
  } = useForm<OrganizationUpdate>({
    mode: "onChange",
    resolver: zodResolver(organizationUpdateSchema),
    defaultValues: useMemo(() => {
      if (organization) {
        return organizationUpdateSchema.parse(organization);
      }
      return {};
    }, [organization]),
  });

  useEffect(() => {
    if (organization) {
      reset(organizationUpdateSchema.parse(organization));
    }
  }, [organization, reset]);

  async function _updateOrganization(data: OrganizationUpdate) {
    setIsOrganizationUpdateBusy(true);
    try {
      if (organization) {
        await updateOrganization(organization.id, data);
        toast.success(t("organization_updated_success"));
        reset({}, { keepValues: true });
        mutateOrganization();
      }
    } catch (_error) {
      toast.error(t("organization_update_error"));
    } finally {
      setIsOrganizationUpdateBusy(false);
    }
  }

  async function _deleteOrganization() {
    setIsDeleteOrganizationBusy(true);

    try {
      if (organization) {
        await deleteOrganization(organization?.id);
        toast.success(t("organization_deleted_success"));
        reset({}, { keepValues: true });
        Cookies.remove("organization");
        signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL });
      }
    } catch (_error) {
      toast.error(t("organization_delete_error"));
    } finally {
      setIsDeleteOrganizationBusy(false);
    }
  }

  async function onOrganizationUpdateSubmit(data: OrganizationUpdate) {
    await _updateOrganization(data);
  }
  return (
    <Box sx={{ p: 4 }}>
      <Box
        component="form"
        onSubmit={handleOrganizationUpdateSubmit(onOrganizationUpdateSubmit)}
      >
        <Stack spacing={theme.spacing(6)}>
          <Divider />
          <Box>
            <Typography variant="body1" fontWeight="bold">
              {t("organization_information")}
            </Typography>
            <Typography variant="caption">
              {t("update_organization_information")}
            </Typography>
          </Box>
          <Divider />

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
                title={t("organization_avatar")}
                avatar={organization?.avatar ?? ""}
              />

              <TextField
                required
                helperText={errors.name ? errors.name?.message : ""}
                label={t("organization_name")}
                id="name"
                {...registerOrganizationUpdate("name")}
                error={errors.name ? true : false}
              />

              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <LoadingButton
                  loading={isOrganizationUpdateBusy}
                  variant="contained"
                  startIcon={
                    <Icon fontSize="small" iconName={ICON_NAME.SAVE} />
                  }
                  aria-label="update-profile"
                  name="update-profile"
                  disabled={isOrganizationUpdateBusy || !isDirty || !isValid}
                  type="submit"
                >
                  {t("update")}
                </LoadingButton>
              </Stack>
            </>
          )}
        </Stack>
      </Box>

      <Box sx={{ mt: 16 }}>
        <Stack spacing={theme.spacing(6)}>
          <Divider />

          {/* Delete Organization Confirmation */}
          <ConfirmModal
            open={confirmDeleteOrganizationDialogOpen}
            title={t("delete_organization")}
            body={
              <Trans
                i18nKey="common:delete_organization_confirmation_body"
                values={{ organization_name: organization?.name }}
                components={{ b: <b />, ul: <ul />, li: <li /> }}
              />
            }
            onClose={() => {
              setConfirmDeleteOrganizationDialogOpen(false);
            }}
            onConfirm={async () => {
              setConfirmDeleteOrganizationDialogOpen(false);
              await _deleteOrganization();
              signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL });
            }}
            closeText={t("close")}
            confirmText={t("delete")}
            matchText={organization?.name}
          />

          <Box>
            <Typography
              variant="body1"
              fontWeight="bold"
              color={theme.palette.error.main}
            >
              {t("danger_zone")}
            </Typography>
            <Typography variant="caption">
              {t("danger_zone_organization_description")}
            </Typography>
          </Box>
          <Divider />
          <Stack>
            <Typography variant="body1">
              <Trans
                i18nKey="common:danger_zone_organization_body"
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
              aria-label="delete-organization"
              name="delete-organization"
              loading={isDeleteOrganizationBusy}
              onClick={() => {
                setConfirmDeleteOrganizationDialogOpen(true);
              }}
              disabled={isOrganizationUpdateBusy}
            >
              <Typography variant="body1" fontWeight="bold" color="inherit">
                {t("delete_organization")}
              </Typography>
            </LoadingButton>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default OrganizationProfile;
