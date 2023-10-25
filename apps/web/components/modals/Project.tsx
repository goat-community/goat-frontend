import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PostProject } from "@/lib/validations/project";
import { postProjectSchema } from "@/lib/validations/project";
import { useFolders } from "@/lib/api/folders";
import type { GetContentQueryParams } from "@/lib/validations/common";
import { useMemo, useState } from "react";
import { RhfAutocompleteField } from "@/components/common/form-inputs/AutocompleteField";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { createProject } from "@/lib/api/projects";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface ProjectDialogProps {
  type: "upload" | "create";
  open: boolean;
  onClose?: () => void;
}

const ProjectModal: React.FC<ProjectDialogProps> = ({
  type,
  open,
  onClose,
}) => {
  console.log(type);
  const queryParams: GetContentQueryParams = {
    order: "descendent",
    order_by: "updated_at",
  };
  const router = useRouter();

  const { folders } = useFolders(queryParams);
  const [isBusy, setIsBusy] = useState(false);
  const {
    handleSubmit,
    register,
    getValues,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<PostProject>({
    mode: "onChange",
    resolver: zodResolver(postProjectSchema),
    defaultValues: {
      description: "",
      //todo: get this from user preferences settings.
      thumbnail_url:
        "https://assets.plan4better.de/img/goat_new_project_artwork.png",
      initial_view_state: {
        latitude: 48.1502132,
        longitude: 11.5696284,
        zoom: 12,
        min_zoom: 0,
        max_zoom: 20,
        bearing: 0,
        pitch: 0,
      },
    },
  });
  const watchFormValues = watch();

  const handleOnClose = () => {
    reset();
    onClose?.();
  };

  const allowSubmit = useMemo(() => {
    return watchFormValues.folder_id;
  }, [watchFormValues]);
  const onSubmit = async () => {
    const values= getValues();
    console.log(values);
    try {
      const project = await createProject(values);
      const { id } = project;
      if (id) {
        console.log(id);
        router.push(`/map/${id}`);
      }
    } catch (_error) {
      toast.error("Error creating project");
    } finally {
      setIsBusy(false);
    }
    setIsBusy(true);
    setIsBusy(false);
  };

  const folderOptions = useMemo(() => {
    return folders?.map((folder) => {
      return {
        value: folder.id,
        label: folder.name,
        icon: (
          <Icon
            fontSize="small"
            iconName={
              folder.name === "home" ? ICON_NAME.HOUSE : ICON_NAME.FOLDER
            }
          />
        ),
      };
    });
  }, [folders]);

  return (
    <Dialog open={open} onClose={handleOnClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Project</DialogTitle>
      <Box sx={{ px: 4, pb: 2 }}>
        <Box
          sx={{ width: "100%" }}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack direction="column" spacing={4} sx={{ my: 1 }}>
            <RhfAutocompleteField
              disabled={isBusy}
              options={folderOptions ?? []}
              control={control}
              name="folder_id"
              label="Folder location"
            />
            <TextField
              fullWidth
              required
              {...register("name")}
              error={errors.name ? true : false}
              label="Name"
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
          </Stack>
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1}
            sx={{ mt: 4 }}
          >
            <Button
              onClick={handleOnClose}
              variant="text"
              sx={{ borderRadius: 0 }}
            >
              <Typography variant="body2" fontWeight="bold">
                Cancel
              </Typography>
            </Button>
            <LoadingButton
              type="submit"
              disabled={isBusy || !allowSubmit}
              loading={isBusy}
              variant="contained"
              color="primary"
            >
              <Typography variant="body2" fontWeight="bold" color="inherit">
                Create
              </Typography>
            </LoadingButton>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ProjectModal;
