import { v4 } from "uuid";

import { Card, Typography, useTheme, Box } from "@mui/material";
import { Icon } from "@p4b/ui/components/Icon";
import type { ISubscriptionStatusCardDataType } from "@/types/dashboard/subscription";

interface SubscriptionStatusCardProps {
  sectionData: ISubscriptionStatusCardDataType;
}

const SubscriptionStatusCard = (props: SubscriptionStatusCardProps) => {
  const { sectionData } = props;

const theme = useTheme();

  return (
    <>
      <Card
        sx={{
          width: "100%",
          padding: `0px ${theme.spacing(3)}`,
          marginBottom: theme.spacing(5),
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(2),
            padding: `${theme.spacing(3)} 0`,
          }}
        >
          <Icon
            iconName={sectionData.icon}
            htmlColor={theme.palette.text.secondary}
            sx={{
              backgroundColor: `${theme.palette.primary.light}50`,
              fontSize: "20px",
              height: "1.5em",
              width: "1.5em",
              padding: "5px 7px",
              borderRadius: "100%",
            }}
          />
          <Typography variant="body1" sx={{ fontWeight: "bolder" }}>
            {sectionData.title}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            [theme.breakpoints.down('sm')]: {
              display: "block"
            },
          }}
        >
          <ul style={{ paddingLeft: "30px" }}>
            {sectionData.listItems.map((listItam: React.ReactNode) => (
              <li style={{ paddingBottom: "12.5px" }} key={v4()}>
                {listItam}
              </li>
            ))}
          </ul>
          {sectionData.action}
        </Box>
      </Card>
    </>
  );
};

export default SubscriptionStatusCard;
