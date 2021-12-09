import React from "react";
import { Paper, makeStyles, createStyles, Theme } from "@material-ui/core";
import styled from "styled-components";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "100%",
      height: "100%",
      position: "relative",
    },
  })
);

type Props = {
  children: JSX.Element | JSX.Element[];
  className?: string;
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  /* IE, Edge 対応 */
  -ms-overflow-style: none;
  /* Firefox 対応 */
  scrollbar-width: none;
  /* Chrome, Safari 対応 */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PaperContainer = (props: Props) => {
  const classes = useStyles();
  return (
    <Paper elevation={2} className={classes.paper}>
      <Container>{props.children}</Container>
    </Paper>
  );
};

export default PaperContainer;
