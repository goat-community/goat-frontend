import { useState } from "react";
import {
  Typography,
  useTheme,
  Stack,
  Switch,
  IconButton,
  MenuList,
  Box
} from "@mui/material";
import CustomMenu from "@/components/common/CustomMenu";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
// import { isNullOrUndefined } from "util";

const SectionHeader = ({
  label,
  active,
  onToggleChange,
  collapsed,
  setCollapsed,
  alwaysActive = false,
  disableAdvanceOptions = false,
  icon = ICON_NAME.CIRCLE,
  moreItems = undefined,
}: {
  label: string;
  active: boolean;
  onToggleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  collapsed?: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  alwaysActive?: boolean;
  disableAdvanceOptions?: boolean;
  icon?: ICON_NAME;
  moreItems?: React.ReactNode;
}) => {
  const [anchorEl, setAnchorEl] = useState<boolean>(false);

  const theme = useTheme();

  function toggleMorePopover() {
    setAnchorEl(!anchorEl);
  }
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" alignItems="center">
        <Icon
          iconName={icon}
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

        {!disableAdvanceOptions && (
          <IconButton
            disabled={!active}
            sx={{
              ...(!collapsed && {
                color: theme.palette.primary.main,
              }),
            }}
            onClick={() => {
              if (setCollapsed) {
                setCollapsed(!collapsed);
              }
            }}
          >
            <Icon
              htmlColor="inherit"
              iconName={ICON_NAME.SLIDERS}
              style={{ fontSize: "15px" }}
            />
          </IconButton>
        )}
        {moreItems ? (
          <Box position="relative">
            <IconButton
              sx={{
                ...(!collapsed && {
                  color: theme.palette.primary.main,
                }),
              }}
              onClick={toggleMorePopover}
            >
              <Icon
                htmlColor="inherit"
                iconName={ICON_NAME.ELLIPSIS}
                style={{ fontSize: "15px" }}
              />
            </IconButton>
            {anchorEl ? (
              <CustomMenu close={toggleMorePopover}>
                <MenuList>{moreItems}</MenuList>
              </CustomMenu>
            ) : null}
          </Box>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default SectionHeader;
