import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { storage, db } from "../../firebase";
import firebase from "firebase/app";
import Header from "../Parts/Header";
import ArrowBackButton from "../Parts/ArrowBackButton";
import DefaultButton from "../Parts/DefaultButton";
import SecondaryButton from "../Parts/SecondaryButton";
import styled from "styled-components";

import {
  makeStyles,
  createStyles,
  Theme,
  Slide,
  IconButton,
} from "@material-ui/core";

import { Settings } from "@material-ui/icons";
import mediaQuery from "styled-media-query";

const mediaMobile = mediaQuery.lessThan("medium");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    settingButton: {
      position: "absolute",
      top: "5px",
      left: "5px",
      width: "42px",
      height: "42px",
    },
  })
);

const Profile = () => {
  const user = useSelector(selectUser);
  const classes = useStyles();
  const userName = user.userName;
  return (
    <main style={{ zIndex: 1 }}>
      <Header child={userName}>
        <IconButton className={classes.settingButton}>
          <Settings />
        </IconButton>
      </Header>
    </main>
  );
};

export default Profile;
