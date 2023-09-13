"use client";

import { makeStyles } from "@/lib/theme";

import { TextField, Card, Typography, Button } from "@mui/material";

const NewsLetterSection = () => {
  const { classes, cx } = useStyles();

  return (
    <Card className={classes.card} >
      <div>
        <Typography variant="h3" className={cx(classes.header, classes.text)}>
          Keep up with GOAT & Plan4Better latest updates, join our Newsletter
        </Typography>
      </div>
      <div className={classes.formSection}>
        <TextField size="small" label="Name" />{" "}
        <TextField size="small" className={classes.textField} label="Email" />{" "}
        <Button className={classes.button} variant="contained" size="large">
          Subscribe
        </Button>
      </div>
      <div>
        <Typography variant="body2" className={classes.text}>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean massa. Cum sociis natoque penatibus
          et magnis dis parturient montes{" "}
        </Typography>
      </div>
    </Card>
  );
};

const useStyles = makeStyles({ name: { NewsLetterSection } })((theme) => ({
  card: {
    width: "100%",
    padding: theme.spacing(6) + theme.spacing(3),
    border: `1px solid ${theme.colors.palette.dark.greyVariant2}10`,
    backgroundColor: theme.colors.palette.light.greyVariant1,
  },
  textField: {
    width: "400px",
  },
  formSection: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    alignItems: "center",
    margin: `${theme.spacing(4)}px 0`,
  },
  text: {
    textAlign: "center",
  },
  header: {
    fontWeight: "bolder",
  },
  button: {
    padding: "12px 24px",
    color: theme.colors.palette.light.main,
    backgroundColor: theme.colors.palette.dark.main,
    "&:hover": {
      backgroundColor: theme.colors.palette.dark.light,
    }
  },
}));

export default NewsLetterSection;
