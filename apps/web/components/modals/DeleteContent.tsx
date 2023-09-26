import type { ActiveCard } from "@/components/dashboard/common/TileCard";
import { LAYERS_API_BASE_URL, deleteLayer } from "@/lib/api/layers";
import { PROJECTS_API_BASE_URL, deleteProject } from "@/lib/api/projects";
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
import { mutate } from "swr";

interface DeleteContentDialogProps {
  open: boolean;
  disabled?: boolean;
  onClose?: () => void;
  onDelete?: () => void;
  activeContent: ActiveCard | null;
}

const DeleteContentModal: React.FC<DeleteContentDialogProps> = (
  props: DeleteContentDialogProps,
) => {
  const { open, disabled, onClose, onDelete, activeContent } = props;

  const handleDelete = async () => {
    try {
      if (!activeContent) return;
      if (activeContent.type === "layer") {
        await deleteLayer(activeContent?.id);
        mutate((key) => Array.isArray(key) && key[0] === LAYERS_API_BASE_URL);
      } else if (activeContent.type === "project") {
        await deleteProject(activeContent?.id);
        mutate((key) => Array.isArray(key) && key[0] === PROJECTS_API_BASE_URL);
      }
      toast.success(`${activeContent?.type} deleted successfully`);
    } catch {
      toast.error(`Error deleting ${activeContent?.type}`);
    }

    onDelete?.();
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
        <Button onClick={onClose} variant="text" sx={{ borderRadius: 0 }}>
          <Typography variant="body2" fontWeight="bold" color="inherit">
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

export default DeleteContentModal;
