import { useTranslation } from "@/i18n/client";
import { inviteMember } from "@/lib/api/organizations";
import { useAppSubscription } from "@/lib/api/subscription";
import { useOrganization } from "@/lib/api/users";
import type { InvitationCreate } from "@/lib/validations/organization";
import { invitationCreateSchema } from "@/lib/validations/organization";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface OrgMemberInviteDialogProps {
  onClose: () => void;
  open: boolean;
  onInvite?: () => void;
}

const OrgMemberInviteModal: React.FC<OrgMemberInviteDialogProps> = ({
  open,
  onClose,
  onInvite,
}) => {
  const theme = useTheme();
  const { t } = useTranslation(["common"]);

  const { organization } = useOrganization();
  const [isBusy, setIsBusy] = useState(false);

  const { subscription } = useAppSubscription();

  const { register, handleSubmit, formState, getValues } =
    useForm<InvitationCreate>({
      mode: "onChange",
      resolver: zodResolver(invitationCreateSchema),
      defaultValues: {
        user_email: "",
        role: "member"
      },
    });

  const onOrganizationMemberInvite = async () => {
    try {
      onInvite?.();
      if (!organization || !subscription?.length) return;
      setIsBusy(true);
      const payload = getValues();
      payload.subscription_id = subscription[0].id;
      await inviteMember(organization.id, payload);
      toast.success(t("common:member_invited_success"));
    } catch {
      toast.error(t("common:member_invite_error"));
    } finally {
      setIsBusy(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("common:invite_member")}</DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <DialogContentText>
          {t("common:invite_member_description")}
        </DialogContentText>
        <Box
          component="form"
          onSubmit={handleSubmit(onOrganizationMemberInvite)}
        >
          <Stack
            spacing={theme.spacing(6)}
            sx={{
              mt: 4,
            }}
          >
            <TextField
              fullWidth
              required
              label={t("common:invite_member_email")}
              {...register("user_email")}
              id="user_email"
            />

            <TextField
              select
              label={t("common:role")}
              defaultValue={getValues("role")}
              size="medium"
              {...register("role")}
            >
              {["admin", "member"].map((role) => (
                <MenuItem key={role} value={role}>
                  {t(`maps:${role}`)}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ mt: 8, mb: 0 }}
          >
            <Button onClick={onClose} variant="text" sx={{ borderRadius: 0 }}>
              <Typography variant="body2" fontWeight="bold">
                {t("common:cancel")}
              </Typography>
            </Button>
            <LoadingButton
              type="submit"
              variant="text"
              disabled={!formState.isValid}
              loading={isBusy}
            >
              <Typography variant="body2" fontWeight="bold" color="inherit">
                {t("common:send_invite")}
              </Typography>
            </LoadingButton>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OrgMemberInviteModal;
