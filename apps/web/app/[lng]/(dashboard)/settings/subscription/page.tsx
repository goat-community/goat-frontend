"use client";

import { useSubscription } from "@/lib/api/subscription";
import { Button, Typography, useTheme, Box, Skeleton } from "@mui/material";
import { v4 } from "uuid";
import SubscriptionStatusCard from "./SubscriptionStatusCard";

import type { ISubscriptionStatusCardDataType } from "@/types/dashboard/subscription";
import type { ISubscriptionCard } from "@/types/dashboard/subscription";

const Subscription = () => {
  const theme = useTheme();

  const { Subscriptions, isError, isLoading } = useSubscription();

  function getSubscriptionDetails(datas: ISubscriptionCard[]) {
    const visualData: ISubscriptionStatusCardDataType[] = datas.map((data) => ({
      icon: data.icon,
      title: data.title,
      listItems: data.listItems.map((item: string) => (
        <Typography variant="body2" key={v4()}>
          {item}
        </Typography>
      )),
      action: (
        <Box
          sx={{
            marginTop: theme.spacing(3),
            [theme.breakpoints.down("md")]: {
              marginTop: 0,
              marginBottom: theme.spacing(3),
            },
          }}
        >
          <Button
            sx={{
              padding: `${theme.spacing(1)} ${theme.spacing(2) + 2}`,
              fontSize: "13px",
            }}
            color="primary"
          >
            Add seats
          </Button>
        </Box>
      ),
    }));
    return visualData;
  }

  function beforeLoadedMessage() {
    if (isLoading) {
      return (
        <>
          <Skeleton variant="rounded" width="100%" height={210} />;
          <Skeleton variant="rounded" width="100%" height={210} />;
          <Skeleton variant="rounded" width="100%" height={210} />;
        </>
      );
    } else if (isError) {
      return "Error";
    } else {
      return "No results found!";
    }
  }

  return (
    <div>
      <Box sx={{ marginBottom: "100px" }}>
        {!isLoading && !isError
          ? [
              ...getSubscriptionDetails([Subscriptions.subscription]),
              ...getSubscriptionDetails(Subscriptions.extensions),
            ].map((extension) => (
              <SubscriptionStatusCard sectionData={extension} key={v4()} />
            ))
          : beforeLoadedMessage()}
      </Box>
    </div>
  );
};

export default Subscription;
