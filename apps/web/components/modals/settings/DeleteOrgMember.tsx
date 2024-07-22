import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";

import { useTranslation } from "@/i18n/client";

import { deleteMember } from "@/lib/api/organizations";
import { useOrganization } from "@/lib/api/users";

import type { OrgMemberDialogBaseProps } from "@/types/dashboard/settings";

interface DeleteOrgMemberDialogProps extends OrgMemberDialogBaseProps {
  disabled?: boolean;
  onDelete?: () => void;
}

const DeleteOrgMemberModal: React.FC<DeleteOrgMemberDialogProps> = ({
  open,
  disabled,
  onClose,
  onDelete,
  member,
}) => {
  const { t } = useTranslation("common");
  const { organization } = useOrganization();
  const [isBusy, setIsBusy] = useState(false);
  const handleDelete = async () => {
    try {
      setIsBusy(true);
      if (!member || !organization) return;
      await deleteMember(organization.id, member.id);
      toast.success(t("member_deleted_success"));
    } catch {
      toast.error(t("member_delete_error"));
    } finally {
      setIsBusy(false);
    }

    onDelete?.();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("delete_member")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("delete_member_description")}
          <br />
          <b>{member?.email}</b>
        </DialogContentText>
      </DialogContent>
      <DialogActions
        disableSpacing
        sx={{
          pb: 2,
        }}>
        <Button onClick={onClose} variant="text" sx={{ borderRadius: 0 }}>
          <Typography variant="body2" fontWeight="bold">
            {t("cancel")}
          </Typography>
        </Button>
        <LoadingButton
          onClick={handleDelete}
          loading={isBusy}
          variant="text"
          color="error"
          disabled={disabled}
          sx={{ borderRadius: 0 }}>
          <Typography variant="body2" fontWeight="bold" color="inherit">
            {t("delete")}
          </Typography>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteOrgMemberModal;
