import React from "react";
import { IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

type Props = {
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      position: "absolute",
      top: "5px",
      left: "5px",
      width: "42px",
      height: "42px",
    },
    closeIcon: {
      left: "5px",
      width: "32px",
      height: "32px",
      borderRadius: "100%",
    },
  })
);

const CloseButton = (props: Props) => {
  const classes = useStyles();
  return (
    <IconButton
      className={classes.closeButton}
      onClick={(e: React.MouseEvent<HTMLElement>) => props.onClick(e)}
    >
      <Close className={classes.closeIcon} />
    </IconButton>
  );
};

export default CloseButton;
