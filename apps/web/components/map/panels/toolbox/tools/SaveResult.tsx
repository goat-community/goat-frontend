import React from "react";
import {
  Box,
  Typography,
  Card,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import { useFolders } from "@/lib/api/folders";
import { v4 } from "uuid";
import { useTranslation } from "@/i18n/client";
import { useGetUniqueLayerName } from "@/hooks/map/ToolsHooks";

import type { SelectChangeEvent } from "@mui/material";

interface SaveResultProps {
  outputName: string | undefined;
  setOutputName: (value: string) => void;
  folderSaveId: string | undefined;
  setFolderSaveID: (value: string) => void;
}

const SaveResult = (props: SaveResultProps) => {
  const { outputName, setOutputName, folderSaveId, setFolderSaveID } = props;

  const theme = useTheme();
  const { t } = useTranslation("maps");

  const { folders } = useFolders();

  const { uniqueName } = useGetUniqueLayerName(outputName ? outputName : "");

  console.log("Unique Name is: ", uniqueName);

  return (
    <Box display="flex" flexDirection="column" gap={theme.spacing(2)}>
      <Typography variant="body1" sx={{ color: "black" }}>
        {t("panels.tools.result")}
      </Typography>
      <Card
        sx={{
          paddingLeft: theme.spacing(2),
          backgroundColor: `${theme.palette.background.default}80`,
        }}
      >
        <RadioGroup aria-label="options" name="options">
          <FormControlLabel
            value={outputName}
            sx={{
              span: {
                fontSize: "12px",
                fontStyle: "italic",
              },
            }}
            control={
              <Radio
                color="default"
                icon={
                  <Icon
                    iconName={ICON_NAME.STAR}
                    htmlColor={theme.palette.primary.dark}
                    sx={{ fontSize: "18px" }}
                  />
                }
                checkedIcon={
                  <Icon
                    iconName={ICON_NAME.STAR}
                    htmlColor={theme.palette.primary.main}
                    sx={{ fontSize: "18px" }}
                  />
                }
              />
            }
            label={outputName}
          />
        </RadioGroup>
      </Card>
      <Typography
        variant="body1"
        sx={{ color: "black", marginTop: theme.spacing(5) }}
      >
        {t("panels.tools.output_name")}
      </Typography>
      <Box>
        <TextField
          fullWidth
          value={outputName ? outputName : ""}
          label="Name"
          size="small"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setOutputName(event.target.value as string)
          }
        />
      </Box>
      <Typography variant="body1" sx={{ color: "black" }}>
        {t("panels.tools.save_in_folder")}
      </Typography>
      <Box>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">
            {t("panels.tools.select_option")}
          </InputLabel>
          <Select
            label={t("panels.tools.select_option")}
            value={folderSaveId}
            onChange={(event: SelectChangeEvent) =>
              setFolderSaveID(event.target.value as string)
            }
          >
            {folders
              ? folders.map((folder) => (
                  <MenuItem value={folder.id} key={v4()}>
                    {folder.name}
                  </MenuItem>
                ))
              : null}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default SaveResult;
