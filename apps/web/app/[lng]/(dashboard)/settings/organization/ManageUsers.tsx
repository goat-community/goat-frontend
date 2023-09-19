"use client";

import SubscriptionCardSkeleton from "@/components/skeletons/SubscriptionCardSkeleton";
import {
  useInviteUserDialog,
  useUserRemovalDialog,
  useUsersData,
} from "@/hooks/dashboard/OrganisationHooks";
import { useState } from "react";

// import { Chip } from "@/components/common/Chip";
import EnhancedTable from "@/components/common/tables/EnhancedTable";
import { TextField, Card, Button, Box, Chip, Typography, IconButton, useTheme } from "@mui/material";
import UserRemovalConfirm from "@/components/dashboard/settings/organization/UserRemovalConfirm";
import type { IUser } from "@/types/dashboard/organization";
import Modal from "@/components/common/Modal";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import InviteUser from "@/components/dashboard/settings/organization/InviteUser";

const ManageUsers = () => {

  const theme = useTheme();

  const [searchWord, setSearchWord] = useState<string>("");
  const { rawRows, setRawRows, setRows, rows, isLoading, error } =
    useUsersData(searchWord);
  const { isAddUser, openInviteDialog, closeInviteDialog, email, setEmail } =
    useInviteUserDialog();
  const {
    userInDialog,
    isModalVisible,
    openUserRemovalDialog,
    closeUserRemovalDialog,
    setTheUserInDialog,
  } = useUserRemovalDialog();

  const columnNames = [
    {
      id: "name",
      numeric: false,
      label: "Name",
    },
    {
      id: "email",
      numeric: false,
      label: "E-mail",
    },
    {
      id: "role",
      numeric: false,
      label: "Role",
    },
    {
      id: "status",
      numeric: false,
      label: "Status",
    },
    {
      id: "added",
      numeric: false,
      label: "Added",
    },
  ];

  function sendInvitation() {
    const newUserInvite: IUser = {
      name: "Luca William Silva",
      email,
      role: "Admin",
      status: "Invite sent",
      Added: "23 Jun 19",
    };
    setRawRows([...rawRows, newUserInvite]);
    closeInviteDialog();
  }

  function editUserRole(
    role: "Admin" | "User" | "Editor",
    user: IUser | undefined,
  ) {
    if (user) {
      const modifiedUsers = rows.map((row: IUser) =>
        row.email === user.email ? { ...row, role } : row,
      );
      setRows(modifiedUsers);
    }
  }

  function removeUser(user: IUser | undefined) {
    if (user) {
      const modifiedUsers = rows.filter(
        (row: IUser) => row.email !== user.email,
      );
      setRawRows(modifiedUsers);
      closeUserRemovalDialog();
    }
  }

  function getStatus() {
    if (isLoading) {
      return <SubscriptionCardSkeleton />;
    } else if (error) {
      return "There is an error with the connection, make sure to be connected to a valid network!";
    } else {
      return "No Result";
    }
  }

  function returnRightFormat(users) {
    return users.map((user) => {
      const modifiedVisualData = user;
      const label =
        typeof user.status !== "string" && user.status?.props
          ? user.status.props.label
          : user.status;
      let color: "primary" | "secondary" | "warning" | undefined = undefined;
      let icon: ICON_NAME | undefined = undefined;

      switch (label) {
        case "Active":
          color = "primary";
          icon = ICON_NAME.CIRCLECHECK;
          break;
        case "Invite sent":
          color = "secondary";
          icon = ICON_NAME.EMAIL;
          break;
        case "Expired":
          color = "warning";
          icon = ICON_NAME.CIRCLEINFO;
          break;
      }

      modifiedVisualData.status = (
        <Chip
          label={label}
          sx={{marginLeft: theme.spacing(4), paddingLeft: theme.spacing(1)}}
          variant="outlined"
          color={color}
          icon={icon ? <Icon iconName={icon} fontSize="small"/> : undefined}
        />
      );
      return modifiedVisualData;
    });
  }

  return (
    <div>
      <Box
        sx={{
          padding: `0px ${theme.spacing(3)}px`,
          marginBottom: theme.spacing(2),
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(2),
            marginBottom: theme.spacing(3),
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
          }}
        >
          <Icon
            iconName={ICON_NAME.USER}
            htmlColor={theme.palette.secondary.main}
            sx={{
              backgroundColor: `${theme.palette.secondary.light}80`,
              fontSize: "20px",
              height: "1.5em",
              width: "1.5em",
              padding: "5px 7px",
              borderRadius: "100%",
            }}
          />

          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Organization name
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: theme.spacing(4),
            marginBottom: theme.spacing(3),
          }}
        >
          <TextField
            sx={{ flexGrow: "1" }}
            type="text"
            label="Search"
            size="small"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSearchWord(event.target.value);
            }}
          />
          <Icon
            iconName={ICON_NAME.FILTER}
            htmlColor={theme.palette.secondary.light}
          />
          <div style={{ position: "relative" }}>
            <Button
              variant="outlined"
              onClick={openInviteDialog}
              sx={{ width: "131px" }}
            >
              Invite user
            </Button>
            {/* Invite User Dialog */}
            {isAddUser ? (
              <Modal
                width="444px"
                open={isAddUser}
                changeOpen={closeInviteDialog}
                action={
                  <Box sx={{float: "right", marginTop: theme.spacing(3)}}>
                    <Button variant="text" onClick={closeInviteDialog}>
                      CANCEL
                    </Button>
                    <Button variant="text" onClick={sendInvitation}>
                      SEND INVITATION
                    </Button>
                  </Box>
                }
                header={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: theme.spacing(1),
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "normal" }}>
                      Invite user
                    </Typography>
                    <IconButton onClick={closeInviteDialog}>
                      <Icon
                        iconName={ICON_NAME.XCLOSE}
                        fontSize="small"
                        htmlColor={
                          theme.palette.secondary.main
                        }
                      />
                    </IconButton>
                  </Box>
                }
              >
                <InviteUser setEmail={setEmail} />
              </Modal>
            ) : null}
          </div>
        </Box>
      </Box>
      <Card
        sx={{ padding: theme.spacing(3), marginBottom: theme.spacing(5), marginTop: theme.spacing(6) }}
      >
        {/* ManageUsers Table */}
        {rows.length ? (
          <EnhancedTable
            rows={returnRightFormat([...rows])}
            columnNames={columnNames}
            openDialog={(value: object | null) =>
              value ? setTheUserInDialog(value as IUser) : undefined
            }
            action={
              <IconButton>
                <Icon iconName={ICON_NAME.MORE_VERT} fontSize="inherit" />
              </IconButton>
            }
            dense={false}
            // alternativeColors={true}
          />
        ) : (
          <Typography variant="body1" color="secondary">
            {getStatus()}
          </Typography>
        )}
      </Card>
      {/* Confirm User Removal */}
      <UserRemovalConfirm
        removeUserFunctions={{
          userInDialog: userInDialog ? userInDialog : undefined,
          isModalVisible,
          removeUser,
          setTheUserInDialog,
          closeUserRemovalDialog,
          openUserRemovalDialog,
          editUserRole,
        }}
      />
    </div>
  );
};

export default ManageUsers;
