import type { ActiveCard } from "@/components/dashboard/home/SectionCard";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";

interface DeleteContentDialogProps {
  open: boolean;
  disabled?: boolean;
  onClose?: () => void;
  onDelete?: () => void;
  activeContent: ActiveCard | null;
}

const DeleteContentModal: React.FC<DeleteContentDialogProps> = ({
  open,
  disabled,
  onClose,
  onDelete,
  activeContent,
}) => {
  const handleDelete = () => {
    if (onDelete) onDelete();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`Delete ${activeContent?.type}`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete {activeContent?.type}{" "}
          <b>{activeContent?.title}</b>?
        </DialogContentText>
      </DialogContent>
      <DialogActions
        disableSpacing
        sx={{
          pb: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="text"
        >
          <Typography variant="body2" fontWeight="bold" color="inherit">
            Cancel
          </Typography>
        </Button>
        <Button
          onClick={handleDelete}
          variant="text"
          color="error"
          disabled={disabled}
        >
          <Typography variant="body2" fontWeight="bold" color="inherit">
            Delete
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteContentModal;
