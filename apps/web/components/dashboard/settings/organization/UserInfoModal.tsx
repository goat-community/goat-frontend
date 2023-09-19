import React, { useState } from "react";
import { v4 } from "uuid";
import type { IUser } from "@/types/dashboard/organization";
import {
  Typography,
  Switch,
  Select,
  MenuItem,
  Box,
  useTheme,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import { styled } from "@mui/material";

interface UserInfoModal {
  ismodalVisible: boolean;
  userInDialog: IUser | undefined;
  editUserRole: (role: string, user: IUser | undefined) => void;
}

const RowBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  alignItems: "center",
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontWeight: "600", color: theme.palette.text.secondary
}));

const UserInfoModal = (props: UserInfoModal) => {
  const { ismodalVisible, userInDialog, editUserRole } = props;

  const theme = useTheme();

  const [extensions, setExtensions] = useState<
    {
      id: string;
      extension: string;
      studyarea: string;
      maxPlaces: number;
      checked: boolean;
      placesLeft: number;
    }[]
  >([
    {
      id: "1",
      extension: "Active mobility",
      studyarea: "Greater Munich",
      maxPlaces: 3,
      placesLeft: 1,
      checked: false,
    },
    {
      id: "2",
      extension: "Motorised mobility",
      studyarea: "Greater Munich",
      maxPlaces: 3,
      placesLeft: 0,
      checked: false,
    },
    {
      id: "3",
      extension: "Active mobility",
      studyarea: "Berlin",
      maxPlaces: 3,
      placesLeft: 2,
      checked: false,
    },
    {
      id: "4",
      extension: "Active mobility",
      studyarea: "London",
      maxPlaces: 3,
      placesLeft: 3,
      checked: false,
    },
  ]);

  const organizationRoles = [
    {
      name: "User",
      value: "User",
    },
    {
      name: "Editor",
      value: "Editor",
    },
    {
      name: "Admin",
      value: "Admin",
    },
  ];

  function handleSwitch(
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    elementName: string | undefined,
  ) {
    if (elementName) {
      extensions.forEach((ext, index) => {
        if (ext.id === elementName) {
          const newExtensionState = extensions;
          if (checked) {
            newExtensionState[index].placesLeft--;
          } else {
            newExtensionState[index].placesLeft++;
          }
          newExtensionState[index].checked = !ext.checked;
          setExtensions([...newExtensionState]);
        }
      });
    }
  }

  function handleSelectUserRole(e: SelectChangeEvent<string>) {
    editUserRole(
      e.target.value,
      typeof userInDialog !== "boolean" ? userInDialog : undefined,
    );
  }

  return (
    <>
      {ismodalVisible ? (
        <Typography variant="body1">
          By removing a user they won&apos;t be able to access any projects
          under your organisation
        </Typography>
      ) : (
        <div>
          <Box
            sx={{
              border: `1px solid ${theme.palette.secondary.main}30`,
              padding: theme.spacing(3),
              borderRadius: 1,
            }}
          >
            <RowBox>
              <TitleTypography variant="body2">Name: </TitleTypography>{" "}
              <Typography variant="body2">
                {userInDialog ? userInDialog?.name : ""}
              </Typography>
            </RowBox>
            <RowBox>
              <TitleTypography variant="body2">E-mail: </TitleTypography>{" "}
              <Typography variant="body2">
                {userInDialog ? userInDialog?.email : ""}
              </Typography>
            </RowBox>
            <RowBox>
              <TitleTypography variant="body2">Added in: </TitleTypography>{" "}
              <Typography variant="body2">
                {userInDialog ? userInDialog?.Added : ""}
              </Typography>
            </RowBox>
            <RowBox>
              <TitleTypography variant="body2">Last Active: </TitleTypography>{" "}
              <Typography variant="body2">3 days ago</Typography>
            </RowBox>
            <RowBox>
              <TitleTypography variant="body2" sx={{ fontWeight: "800" }}>
                Status:{" "}
              </TitleTypography>{" "}
              <Box sx={{ marginTop: "3px" }}>
                {userInDialog ? userInDialog?.status : ""}
              </Box>
            </RowBox>
            <RowBox>
              <TitleTypography variant="body2">Organisation role: </TitleTypography>{" "}
              <Select
                size="small"
                label="Role"
                defaultValue={userInDialog ? userInDialog?.role : ""}
                onChange={handleSelectUserRole}
              >
                {organizationRoles.map((role) => (
                  <MenuItem key={v4()} value={role.value}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </RowBox>
          </Box>
          <Box sx={{ margin: `${theme.spacing(5)} 0px` }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Extensions:
            </Typography>
            {extensions.map((extension) => (
              <Box sx={{ display: "flex", alignItems: "center", gap: theme.spacing(2) }} key={v4()}>
                <Switch
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing(1),
                    marginTop: theme.spacing(2),
                  }}
                  checked={extension.checked}
                  onChange={(
                    event: React.ChangeEvent<HTMLInputElement>,
                    checked: boolean,
                  ) => handleSwitch(event, checked, extension.id)}
                  disabled={!extension.placesLeft && !extension.checked}
                />
                <Typography variant="body2">
                  {extension.extension} - {extension.studyarea}
                </Typography>
                <Typography variant="body2" color="secondary">
                  {extension.placesLeft} of {extension.maxPlaces} seats
                  available
                </Typography>
              </Box>
            ))}
          </Box>
        </div>
      )}
    </>
  );
};

export default UserInfoModal;
