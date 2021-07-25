import React from "react";
import { Paper, makeStyles, createStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperForPreview: {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: "0",
      left: "0",
    },
  })
);

type Props = {
  children: any;
};

const PaperForPreview = (props: Props) => {
  const classes = useStyles();
  return (
    <Paper elevation={2} className={classes.paperForPreview}>
      {props.children}
    </Paper>
  );
};

export default PaperForPreview;
