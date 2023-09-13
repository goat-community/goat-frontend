import React from "react";
import { Typography, Box } from "@mui/material";
import type { HomeCardType } from "@/types/dashboard/home";
import { useTheme } from "@/lib/theme";
import { Icon } from "@p4b/ui/components/Icon";
import { makeStyles } from "@/lib/theme";
import ChipList from "@/components/dashboard/home/ChipList";

interface HomeCardProps {
  card: HomeCardType;
}

const HomeCard = (props: HomeCardProps) => {
  const { card } = props;

  const theme = useTheme();
  const { classes } = useStyles();

  return (
    <Box>
      {card.info ? (
        <Typography variant="body2" color="secondary" sx={{ opacity: "80%" }}>
          {card.info.author} • {card.info.date}
        </Typography>
      ) : null}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: card.icon ? "12px" : "0px",
        }}
      >
        {card.icon ? (
          <Icon iconName={card.icon} className={classes.iconWrapper} />
        ) : null}
        <Typography
          variant="body1"
          color="secondary"
          sx={{
            padding: `${card.info ? "12px" : "4px"} 4px`,
            fontWeight: "500",
          }}
        >
          {card.title}
        </Typography>
      </Box>
      {card.description ? (
        <Typography variant="body2" color="secondary" sx={{ opacity: "80%" }}>
          {card.description}
        </Typography>
      ) : null}
      <Box sx={{marginTop: "16px"}}>
        <ChipList chips={card.chips} />
      </Box>
    </Box>
  );
};

const useStyles = makeStyles({ name: { HomeCard } })((theme) => ({
  iconWrapper: {
    backgroundColor: `${theme.colors.palette.focus.main}80`,
    fontSize: "18px",
    height: "1.5em",
    width: "1.5em",
    padding: "5px 7px",
    borderRadius: "100%",
    color: theme.colors.palette.light.main,
  },
}));

export default HomeCard;
