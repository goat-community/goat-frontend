import {
  FOLDERS_API_BASE_URL,
  createFolder,
  updateFolder,
  deleteFolder,
} from "@/lib/api/folders";
import { DialogBaseProps } from "@/types/common/dialog";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";

export interface SelectedFolderForEdit {
  id: string;
  name: string;
}

interface EditFolderDialogProps extends DialogBaseProps {
  type: "create" | "update" | "delete";
  selectedFolder?: SelectedFolderForEdit;
  disabled?: boolean;
  onEdit?: () => void;
  existingFolderNames?: string[];
}

const EditFolderModal: React.FC<EditFolderDialogProps> = ({
  type,
  selectedFolder,
  open,
  existingFolderNames,
  onClose,
  onEdit,
}) => {
  const [folderName, setFolderName] = useState<string>("");

  const handleFolderEdit = async () => {
    try {
      if (type === "create") {
        await createFolder(folderName);
        toast.success("Folder created successfully");
      }
      if (selectedFolder?.id) {
        if (type === "delete") {
          await deleteFolder(selectedFolder?.id);
          toast.success("Folder deleted successfully");
        }

        if (type === "update") {
          await updateFolder(selectedFolder.id, folderName);
          toast.success("Folder updated successfully");
        }
      }

      mutate((key) => Array.isArray(key) && key[0] === FOLDERS_API_BASE_URL);
    } catch (error) {
      toast.error(error.message);
    }

    setFolderName("");
    onEdit?.();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setFolderName("");
        onClose?.();
      }}
    >
      <DialogTitle>
        <Typography variant="h6">
          {
            {
              create: "Create Folder",
              update: "Update Folder",
              delete: "Delete Folder",
            }[type]
          }
        </Typography>
      </DialogTitle>
      <DialogContent>
        {["update", "create"].includes(type) && (
          <TextField
            autoFocus={true}
            autoComplete="off"
            sx={{ my: 2, minWidth: 300 }}
            id="folder-name"
            defaultValue={selectedFolder?.name || folderName}
            inputProps={{ maxLength: 30 }}
            label="Folder Name"
            variant="outlined"
            error={
              folderName.length > 29 ||
              existingFolderNames?.includes(folderName)
            }
            helperText={
              folderName.length > 29
                ? "Folder name must be less than 30 characters"
                : existingFolderNames?.includes(folderName)
                ? "Folder name already exists"
                : ""
            }
            onChange={(e) => setFolderName(e.target.value)}
          />
        )}

        {type === "delete" && (
          <DialogContentText>
            Are you sure you want to delete <b>{selectedFolder?.name}</b>?
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions
        disableSpacing
        sx={{
          pb: 2,
        }}
      >
        <Button
          onClick={() => {
            setFolderName("");
            onClose?.();
          }}
          variant="text"
          sx={{ borderRadius: 0 }}
        >
          <Typography variant="body2" fontWeight="bold">
            Cancel
          </Typography>
        </Button>
        <Button
          disabled={folderName === "" && type !== "delete"}
          onClick={handleFolderEdit}
          variant="text"
          color={type === "delete" ? "error" : "primary"}
          sx={{ borderRadius: 0 }}
        >
          <Typography variant="body2" fontWeight="bold" color="inherit">
            {
              {
                create: "Create",
                update: "Update",
                delete: "Delete",
              }[type]
            }
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFolderModal;
