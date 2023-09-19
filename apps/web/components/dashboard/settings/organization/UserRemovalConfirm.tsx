import React from "react";
import UserInfoModal from "./UserInfoModal";
import { Typography, Button, IconButton, useTheme, Box } from "@mui/material";
import { Icon, ICON_NAME } from "@p4b/ui/components/Icon";
import type { IUser } from "@/types/dashboard/organization";
import Modal from "@/components/common/Modal";

interface UserRemovalFunctions {
  userInDialog: IUser | undefined;
  isModalVisible: boolean;
  removeUser: (user: IUser | undefined) => void;
  setTheUserInDialog: (user: IUser | undefined) => void;
  closeUserRemovalDialog: () => void;
  openUserRemovalDialog: (user: IUser | undefined) => void;
  editUserRole: (
    role: "Admin" | "User" | "Editor",
    user: IUser | undefined,
  ) => void;
}

interface UserRemovalConfirmProps {
  removeUserFunctions: UserRemovalFunctions;
}

const UserRemovalConfirm: React.FC<UserRemovalConfirmProps> = ({
  removeUserFunctions,
}) => {
  const {
    userInDialog,
    isModalVisible,
    removeUser,
    setTheUserInDialog,
    closeUserRemovalDialog,
    openUserRemovalDialog,
    editUserRole,
  } = removeUserFunctions;

  const theme = useTheme();

  const renderModalHeader = () => {
    if (isModalVisible) {
      return (
        <Typography
          sx={{ display: "flex", alignItems: "center", gap: theme.spacing(2) }}
          variant="h6"
        >
          <Icon
            fontSize="small"
            iconName={ICON_NAME.CIRCLEINFO}
            htmlColor={theme.palette.warning.main}
          />{" "}
          Attention
        </Typography>
      );
    } else {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "normal" }}>
            {userInDialog instanceof Object && "name" in userInDialog
              ? userInDialog.name
              : ""}
          </Typography>
          <IconButton onClick={closeUserRemovalDialog}>
            <Icon
              iconName={ICON_NAME.XCLOSE}
              fontSize="small"
              htmlColor={theme.palette.secondary.main}
            />
          </IconButton>
        </Box>
      );
    }
  };

  return (
    <Modal
      width="523px"
      open={Boolean(userInDialog)}
      changeOpen={() => setTheUserInDialog(undefined)}
      action={
        isModalVisible ? (
          <Box sx={{marginTop: theme.spacing(4), float: "right"}}>
            <Button onClick={closeUserRemovalDialog} variant="text">
              CANCEL
            </Button>
            <Button onClick={() => removeUser(userInDialog)} variant="text">
              CONFIRM
            </Button>
          </Box>
        ) : (
          <Button
            onClick={() => openUserRemovalDialog(userInDialog)}
            variant="text"
            color="primary"
            sx={{ float: "right" }}
          >
            REMOVE USER
          </Button>
        )
      }
      header={renderModalHeader()}
    >
      <UserInfoModal
        ismodalVisible={isModalVisible}
        userInDialog={userInDialog}
        editUserRole={editUserRole}
      />
    </Modal>
  );
};

export default UserRemovalConfirm;
