import { LAYERS_API_BASE_URL, deleteLayer } from "@/lib/api/layers";
import { PROJECTS_API_BASE_URL, deleteProject } from "@/lib/api/projects";
import type { Layer } from "@/lib/validations/layer";
import type { Project } from "@/lib/validations/project";
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
  type: "project" | "layer";
  content: Project | Layer;
}

const DeleteContentModal: React.FC<DeleteContentDialogProps> = ({
  open,
  disabled,
  onClose,
  onDelete,
  type,
  content,
}) => {
  const handleDelete = async () => {
    try {
      if (!content) return;
      if (type === "layer") {
        await deleteLayer(content?.id);
        mutate((key) => Array.isArray(key) && key[0] === LAYERS_API_BASE_URL);
      } else if (type === "project") {
        await deleteProject(content?.id);
        mutate((key) => Array.isArray(key) && key[0] === PROJECTS_API_BASE_URL);
      }
      toast.success(`${type} deleted successfully`);
    } catch {
      toast.error(`Error deleting ${type}`);
    }

    onDelete?.();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{`Delete ${type}`}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete {type} <b>{content?.name}</b>?
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

export default DeleteContentModal;
