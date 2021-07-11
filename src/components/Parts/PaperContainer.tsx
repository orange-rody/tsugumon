import React from "react";
import { Paper, makeStyles, createStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "100%",
      height: "100%",
    },
  })
);

type Props = {
  children: JSX.Element;
};

const PaperContainer = (props: Props) => {
  const classes = useStyles();
  return (
    <Paper elevation={2} className={classes.paper}>
      {props.children}
    </Paper>
  );
};

export default PaperContainer;