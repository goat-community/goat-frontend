import LayerMetadataForm from "@/components/common/LayerMetadataForm";
import type { LayerMetadata } from "@/lib/validations/layer";
import type { ContentDialogBaseProps } from "@/types/dashboard/content";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface MetadataDialogProps extends ContentDialogBaseProps {}

const Metadata: React.FC<MetadataDialogProps> = ({
  open,
  onClose,
  content,
}) => {
  const onSubmit = (data: LayerMetadata) => {
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

export default Metadata;
