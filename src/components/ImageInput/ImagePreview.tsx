import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { auth, storage, db } from "../../firebase";
import firebase from "firebase/app";
import styled from "styled-components";
import mediaQuery from "styled-media-query";
import {
  Paper,
  Button,
  createMuiTheme,
  makeStyles,
  createStyles,
  Theme,
  ThemeProvider,
  useMediaQuery,
} from "@material-ui/core";

const mediaMobile = mediaQuery.lessThan("medium");

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#4fc0ad",
      main: "#008f7e",
      dark: "#006152",
      contrastText: "#fff",
    },
    secondary: {
      light: "#50a0d0",
      main: "#00729f",
      dark: "#004770",
      contrastText: "#fff",
    },
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperA: {
      width: "40vw",
      margin: "20px auto",
    },
    paperB: {
      width: "100vw",
    },
    button: {
      width: "120px",
      height: "40px",
      borderRadius: "50px",
      fontSize: "18px",
      fontWeight: "bold",
    },
  })
);

const Label = styled.div`
  display: flex;
  width: 100%;
  height: 42px;
  margin: 0 auto;
  background-color: rgb(221, 202, 175);
  background-size: 10px 10px;
  border-bottom: 1px solid hsla(26, 100%, 12%, 0.2);
  box-sizing: border-box;
`;

const Title = styled.h2`
  width: 150px;
  height: 42px;
  margin: 0 auto;
  font-size: 18px;
  line-height: 42px;
  text-align: center;
  color: hsl(0, 0%, 10%);
  font-weight: bold;
`;

const Main = styled.main`
  display: flex;
  flex-flow: column;
  width: 100%;
  margin: 0 auto;
  background-color: hsl(0, 0%, 100%);
`;

const ImageWrap = styled.div`
  width: 100%;
  margin: 0 auto;
  position: relative;
  :before {
    content: "";
    display: block;
    padding-top: 75%;
  }
`;

const PhotoImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
`;

const ButtonArea = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  margin-top: 20px;
  justify-content: space-around;
`;

const Commentarea = styled.p`
  width: 90%;
  height: 100px;
  margin: 20px auto 0;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  background-color: rgba(221, 202, 175, 0.3);
`;

