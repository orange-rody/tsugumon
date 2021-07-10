import React from "react";
import { IconButton } from "@material-ui/core";
import { ArrowLeft } from "@material-ui/icons";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

type Props = {
  dataTestId: string
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    arrowLeftButton: {
      position: "absolute",
      top: "5px",
      left: "5px",
      width: "42px",
      height: "42px",
    },
    arrowLeftIcon: {
      width: "42px",
      height: "42px",
      borderRadius: "100%",
    },
  })
);

const ArrowBackButton = (props: Props) => {
  const classes = useStyles();
  return (
    <IconButton
      className={classes.arrowLeftButton}
      data-testid={props.dataTestId}
      onClick={(e: React.MouseEvent<HTMLElement>) => props.onClick(e)}
    >
      <ArrowLeft className={classes.arrowLeftIcon} />
    </IconButton>
  );
};

export default ArrowBackButton;
