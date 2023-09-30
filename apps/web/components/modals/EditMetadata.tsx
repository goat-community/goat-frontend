import LayerMetadataForm from "@/components/common/LayerMetadataForm";
import type { Layer } from "@/lib/validations/layer";
import { ContentDialogBaseProps } from "@/types/dashboard/content";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface EditMetadataDialogProps extends ContentDialogBaseProps {}

const EditMetadata: React.FC<EditMetadataDialogProps> = ({
  open,
  onClose,
  content,
}) => {
  const onSubmit = (data: Layer) => {
    console.log(data);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Metadata</DialogTitle>
      <DialogContent>
        <LayerMetadataForm layer={content} onSubmit={onSubmit} />
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
        <Button variant="text" color="error" sx={{ borderRadius: 0 }}>
          <Typography variant="body2" fontWeight="bold" color="inherit">
            Update
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditMetadata;
