import { Stack, FormHelperText, Tooltip } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface FormLabelHelperProps {
  label: string;
  color: string;
  tooltip?: string;
}

const FormLabelHelper: React.FC<FormLabelHelperProps> = ({
  label,
  color,
  tooltip,
}) => (
  <Stack
    direction="row"
    alignItems="center"
    sx={{
      color: color,
      mb: 1,
    }}
  >
    <FormHelperText sx={{ color: "inherit", ml: 0, mt: 0, mr: 1 }}>
      {label}
    </FormHelperText>
    {tooltip && (
      <Tooltip title={tooltip} placement="top" arrow>
        <HelpOutlineIcon
          style={{
            fontSize: "12px",
          }}
        />
      </Tooltip>
    )}
  </Stack>
);

export default FormLabelHelper;