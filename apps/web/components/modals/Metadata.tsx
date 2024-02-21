import { useTranslation } from "@/i18n/client";
import { LAYERS_API_BASE_URL, updateDataset } from "@/lib/api/layers";
import { PROJECTS_API_BASE_URL, updateProject } from "@/lib/api/projects";
import {
  layerMetadataSchema,
  type LayerMetadata,
} from "@/lib/validations/layer";
import type { ContentDialogBaseProps } from "@/types/dashboard/content";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { mutate } from "swr";

interface MetadataDialogProps extends ContentDialogBaseProps {}

const Metadata: React.FC<MetadataDialogProps> = ({
  open,
  onClose,
  content,
  type,
}) => {
  const { t } = useTranslation("maps");
  const [isBusy, setIsBusy] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<LayerMetadata>({
    mode: "onChange",
    resolver: zodResolver(layerMetadataSchema),
    defaultValues: { ...content },
  });

  const onSubmit = async (data: LayerMetadata) => {
    try {
      setIsBusy(true);
      const postMethod = type === "layer" ? updateDataset : updateProject;
      await postMethod(content.id, {
        folder_id: content.folder_id,
        ...data,
      });
      const mutateUrl =
        type === "layer" ? LAYERS_API_BASE_URL : PROJECTS_API_BASE_URL;
      mutate((key) => Array.isArray(key) && key[0] === mutateUrl);
      toast.success(t("metadata_updated_success"));
    } catch (error) {
      toast.error(t("metadata_updated_error"));
    } finally {
      setIsBusy(false);
      onClose && onClose();
    }
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t("edit_metadata")}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <Stack spacing={4}>
            <TextField
              fullWidth
              label={t("name")}
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label={t("description")}
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <TextField
              fullWidth
              label={t("data_source")}
              {...register("data_source")}
              error={!!errors.data_source}
              helperText={errors.data_source?.message}
            />
            <TextField
              fullWidth
              label={t("data_reference_year")}
              type="number"
              {...register("data_reference_year", {
                setValueAs: (v) => v === "" ? undefined : parseInt(v, 10),
              })}
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
            {t("cancel")}
          </Typography>
        </Button>
        <LoadingButton
          variant="contained"
          disabled={!isValid}
          loading={isBusy}
          onClick={handleSubmit(onSubmit)}
        >
          <Typography variant="body2" fontWeight="bold" color="inherit">
            {t("update")}
          </Typography>
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default Metadata;
