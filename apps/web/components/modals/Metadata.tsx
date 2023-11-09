import LayerMetadataForm from "@/components/common/LayerMetadataForm";
import {
  layerMetadataSchema,
  type LayerMetadata,
} from "@/lib/validations/layer";
import type { ContentDialogBaseProps } from "@/types/dashboard/content";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  TextField,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";

interface MetadataDialogProps extends ContentDialogBaseProps {}

const Metadata: React.FC<MetadataDialogProps> = ({
  open,
  onClose,
  content,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LayerMetadata>({
    mode: "onChange",
    resolver: zodResolver(layerMetadataSchema),
    defaultValues: { ...content },
  });

  const onSubmit = (data: LayerMetadata) => {
    console.log(data);
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Metadata</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <Stack spacing={4}>
            <TextField
              fullWidth
              label="Name"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <TextField
              fullWidth
              label="Data Source"
              {...register("data_source")}
              error={!!errors.data_source}
              helperText={errors.data_source?.message}
            />
            <TextField
              fullWidth
              label="Data reference year"
              {...register("data_reference_year")}
              error={!!errors.data_reference_year}
              helperText={errors.data_reference_year?.message}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions
        disableSpacing
        sx={{
          pb: 2,
        }}
      >
        <Button onClick={onClose} variant="text">
          <Typography variant="body2" fontWeight="bold">
            Cancel
          </Typography>
        </Button>
        <Button variant="text">
          <Typography variant="body2" fontWeight="bold" color="inherit">
            Update
          </Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Metadata;
