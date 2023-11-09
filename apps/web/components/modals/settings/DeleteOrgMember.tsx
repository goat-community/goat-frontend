import { deleteMember } from "@/lib/api/organizations";
import type { OrgMemberDialogBaseProps } from "@/types/dashboard/settings";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
// import { mutate } from "swr";

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
  const handleDelete = async () => {
    try {
      if (!member) return;
      await deleteMember("org_id", member.id);
      toast.success(`Member deleted successfully`);
    } catch {
      toast.error(`Error deleting member`);
    }

    onDelete?.();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Member</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to remove this member from the organization?
          <br />
          <b>{member?.email}</b>
        </DialogContentText>
      </DialogContent>
      <DialogActions
        disableSpacing
        sx={{
          pb: 2,
        }}
      >
        <Button onClick={onClose} variant="text" sx={{ borderRadius: 0 }}>
          <Typography variant="body2" fontWeight="bold">
            Cancel
          </Typography>
        </Button>
        <Button
          onClick={handleDelete}
          variant="text"
          color="error"
          disabled={disabled}
          sx={{ borderRadius: 0 }}
        >
          <Typography variant="body2" fontWeight="bold" color="inherit">
            Delete
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteOrgMemberModal;
