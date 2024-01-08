import { Typography, useTheme, Stack, Switch, IconButton } from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";

const Header = ({
  label,
  active,
  onToggleChange,
  collapsed,
  setCollapsed,
  alwaysActive = false,
}: {
  label: string;
  active: boolean;
  onToggleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  alwaysActive?: boolean;
}) => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center">
        <Icon
          iconName={ICON_NAME.CIRCLE}
          style={{
            fontSize: "17px",
            color: active
              ? theme.palette.text.secondary
              : theme.palette.text.disabled,
          }}
        />
        <Typography
          variant="body2"
          fontWeight="bold"
          sx={{ pl: 2 }}
          color={
            active ? theme.palette.text.secondary : theme.palette.text.disabled
          }
        >
          {label}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center">
        {alwaysActive ? null : (
          <Switch size="small" checked={!!active} onChange={onToggleChange} />
        )}
        <IconButton
          disabled={!active}
          sx={{
            ...(!collapsed && {
              color: theme.palette.primary.main,
            }),
          }}
          onClick={() => {
            setCollapsed(!collapsed);
          }}
        >
          <Icon
            htmlColor="inherit"
            iconName={ICON_NAME.SLIDERS}
            style={{ fontSize: "15px" }}
          />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default Header;