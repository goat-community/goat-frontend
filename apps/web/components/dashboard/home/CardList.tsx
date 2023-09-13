"use client";

import { makeStyles } from "@/lib/theme";
import { v4 } from "uuid";

import {
  Card,
  CardMedia,
  CardContent,
  Divider,
  Typography,
  Button,
} from "@mui/material";
import { useTheme } from "@/lib/theme";
import HomeCard from "@/components/dashboard/home/HomeCard";
import Link from "next/link";
import type { CardsDataArray } from "@/types/dashboard/home";

interface CardListProps {
  title: string;
  buttons: { label: string; path: string }[];
  cards?: CardsDataArray[];
}

const CardList = (props: CardListProps) => {
  const { title, buttons, cards } = props;

  const theme = useTheme();
  const { classes } = useStyles();

  return (
    <>
      <div className={classes.headerTitles}>
        <Typography variant="h3">{title}</Typography>
        <div className={classes.buttons}>
          {buttons.map((button) => (
            <Link
              key={v4()}
              href={button.path}
              style={{ textDecoration: "none" }}
            >
              <Typography variant="h4" className={classes.button}>
                {button.label}
              </Typography>
            </Link>
          ))}
        </div>
      </div>
      <Divider color="main" sx={{ margin: `${theme.spacing(4)}px 0` }} />
      <div className={classes.cardList}>
        {cards?.map((card) => (
          <Card key={v4()} sx={{ width: 268 }}>
            {card.media ? (
              <CardMedia
                sx={{ height: 100 }}
                image={card.media.image}
                title="image"
              />
            ) : (
              false
            )}

            <CardContent>
              <HomeCard card={card.content} />
            </CardContent>
          </Card>
        ))}
        {cards?.length && cards.length < 4 ? (
          <Card sx={{ width: 268 }}>
            <div className={classes.addButtonContainer}>
              <Button
                variant="text"
                color="secondary"
                className={classes.addButton}
              >
                <Typography variant="button">+</Typography>
                <Typography variant="button">New</Typography>
              </Button>
            </div>
          </Card>
        ) : null}
      </div>
    </>
  );
};

const useStyles = makeStyles({ name: { CardList } })((theme) => ({
  cardList: {
    display: "flex",
    gap: theme.spacing(4),
    marginBottom: "57px",
  },
  headerTitles: {
    display: "flex",
    justifyContent: "space-between",
  },
  buttons: {
    display: "flex",
    gap: theme.spacing(3),
  },
  button: {
    border: "none",
    color: theme.colors.palette.focus.main,
    textDecoration: "none",
  },
  addButtonContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "3px",
    width: "80%",
    margin: "0 auto",
    borderRadius: "10px",
  },
}));

export default CardList;
