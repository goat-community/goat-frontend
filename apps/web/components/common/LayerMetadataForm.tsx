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

    const onSubmit = (data: LayerMetadata) => {
    console.log(data);
  };
  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} {...props}>

    </Box>
  );
};

export default LayerMetadataForm;
