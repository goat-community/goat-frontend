import type { LayerMetadata } from "@/lib/validations/layer";
import { layerMetadataSchema } from "@/lib/validations/layer";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

interface LayerMetadataFormProps {
  onSubmit: (data: LayerMetadata) => void;
  isBusy?: boolean;
  isEdit?: boolean;
  layer?: LayerMetadata;
}

const LayerMetadataForm: React.FC<LayerMetadataFormProps> = ({
  layer,
  onSubmit,
  ...props
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LayerMetadata>({
    mode: "onChange",
    resolver: zodResolver(layerMetadataSchema),
    defaultValues: { ...layer },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} {...props}>
      <TextField
        fullWidth
        label="Name"
        margin="normal"
        variant="outlined"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Description"
        margin="normal"
        variant="outlined"
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      <TextField
        fullWidth
        label="Data Source"
        margin="normal"
        variant="outlined"
        {...register("data_source")}
        error={!!errors.data_source}
        helperText={errors.data_source?.message}
      />
      <TextField
        fullWidth
        label="Data reference year"
        margin="normal"
        variant="outlined"
        {...register("data_reference_year")}
        error={!!errors.data_reference_year}
        helperText={errors.data_reference_year?.message}
      />
    </Box>
  );
};

export default LayerMetadataForm;
