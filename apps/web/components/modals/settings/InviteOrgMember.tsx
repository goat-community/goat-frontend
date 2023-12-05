import { useTranslation } from "@/i18n/client";
import type {
  InvitationCreate} from "@/lib/validations/organization";
import {
  invitationCreateSchema,
} from "@/lib/validations/organization";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const { t } = useTranslation(["common", "dashboard"]);

  const { register, handleSubmit, formState, getValues } =
    useForm<InvitationCreate>({
      mode: "onChange",
      resolver: zodResolver(invitationCreateSchema),
      defaultValues: {
        user_email: "",
        role: "member",
        subscription_id: "55281d38-f8ca-431b-875a-5d949d68fdf1",
      },
    });

  const onOrganizationMemberInvite = async () => {
    try {
      onInvite?.();
    } catch (error) {
      toast.error(error.message);
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("dashboard:invite_member")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("dashboard:invite_member_description")}
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
              label={t("dashboard:invite_member_email")}
              {...register("user_email")}
              id="user_email"
            />

            <TextField
              select
              label={t("dashboard:role")}
              defaultValue={getValues("role")}
              size="medium"
              {...register("role")}
            >
              {["admin", "member"].map((role) => (
                <MenuItem key={role} value={role}>
                  {t(`dashboard:${role}`)}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            sx={{ mt: 8, marginBottom: "-15px" }}
          >
            <Button onClick={onClose} variant="text" sx={{ borderRadius: 0 }}>
              <Typography variant="body2" fontWeight="bold">
                Cancel
              </Typography>
            </Button>
            <Button type="submit" variant="text" disabled={!formState.isValid}>
              <Typography variant="body2" fontWeight="bold" color="inherit">
                Send Invite
              </Typography>
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OrgMemberInviteModal;
