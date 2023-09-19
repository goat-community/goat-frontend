"use client";

import SubscriptionStatusCard from "@/app/[lng]/(dashboard)/settings/subscription/SubscriptionStatusCard";
import React from "react";
import type { ISubscriptionCard } from "@/types/dashboard/subscription";
import { v4 } from "uuid";

import Modal from "@/components/common/Modal";
import {
  Button,
  Typography,
  TextField,
  Box,
  useTheme,
  Skeleton,
} from "@mui/material";
import { ICON_NAME, Icon } from "@p4b/ui/components/Icon";
import { useOrganization } from "@/lib/api/users";

const Overview = () => {
  const [organizationEdit, setOrganizationEdit] =
    React.useState<boolean>(false);

  const theme = useTheme();

  const { isLoading, organization, isError } = useOrganization();

  function beforeLoadedMessage() {
    if (isLoading) {
      return <Skeleton variant="rounded" width="100%" height={210} />;
    } else if (isError) {
      return "Error";
    } else {
      return "No results found!";
    }
  }

  function getOrganizationOverviewDetails(data: ISubscriptionCard) {
    const visualData = {
      icon: organization.icon,
      title: organization.title,
      listItems: organization.listItems.map((item: string) => (
        <Typography variant="body2" key={v4()}>
          {item}
        </Typography>
      )),
      action: (
        <Box sx={{ position: "relative" }}>
          <Button
            onClick={() => setOrganizationEdit(true)}
            sx={{
              marginTop: theme.spacing(3),
              padding: `${theme.spacing(1)}px ${theme.spacing(2) + 2}px`,
              fontSize: "13px",
            }}
            variant="outlined"
            color="primary"
          >
            Manage license
          </Button>
          <Modal
            open={organizationEdit}
            changeOpen={setOrganizationEdit}
            width="444px"
            action={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  gap: theme.spacing(1),
                }}
              >
                <Button
                  variant="text"
                  onClick={() => setOrganizationEdit(false)}
                >
                  CANCEL
                </Button>
                <Button variant="text">UPDATE</Button>
              </Box>
            }
            header={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: theme.spacing(3),
                }}
              >
                <Icon
                  iconName={ICON_NAME.USER}
                  htmlColor={theme.palette.text.secondary}
                  sx={{
                    backgroundColor: `${theme.palette.secondary.light}80`,
                    fontSize: "20px",
                    height: "1.5em",
                    width: "1.5em",
                    padding: "5px 7px",
                    borderRadius: "100%",
                  }}
                />
                <Typography
                  sx={{ fontWeight: "bold", marginLeft: theme.spacing(2) }}
                  variant="body1"
                >
                  {data.title}
                </Typography>
              </Box>
            }
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing(2),
                marginBottom: theme.spacing(4),
              }}
            >
              <TextField type="text" label="New name" size="small" />
              <TextField
                type="password"
                label="Confirm password"
                size="small"
              />
            </Box>
          </Modal>
        </Box>
      ),
    };
    return visualData;
  }

  return (
    <div>
      {!isLoading && !isError ? (
        <SubscriptionStatusCard
          sectionData={getOrganizationOverviewDetails(Organization)}
          key={v4()}
        />
      ) : (
        beforeLoadedMessage()
      )}
    </div>
  );
};

export default Overview;
