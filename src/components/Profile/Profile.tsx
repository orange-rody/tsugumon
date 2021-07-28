import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
// import { storage, db } from "../../firebase";
// import firebase from "firebase/app";
import Header from "../Parts/Header";
// import ArrowBackButton from "../Parts/ArrowBackButton";
// import DefaultButton from "../Parts/DefaultButton";
// import SecondaryButton from "../Parts/SecondaryButton";
import IconButton from "../Parts/IconButton";
import styled from "styled-components";
import { makeStyles, createStyles, Theme, Slide } from "@material-ui/core";

import { Settings } from "@material-ui/icons";
import mediaQuery from "styled-media-query";

const mediaMobile = mediaQuery.lessThan("medium");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    settingIcon: {
      left: "5px",
      width: "32px",
      height: "42px",
      borderRadius: "100%",
    },
  })
);

const Profile = () => {
  const user = useSelector(selectUser);
  const [buttonPushed, setButtonPushed] = useState(false);
  const userName = user.userName;
  const classes = useStyles();
  return (
    <main style={{ zIndex: 1 }}>
      <Header child={userName}>
        <IconButton
          onClick={(e: React.MouseEvent<HTMLElement>) =>
            setButtonPushed(!buttonPushed)
          }
          dataTestId="settings"
        >
          <Settings className={classes.settingIcon} />
        </IconButton>
      </Header>
      {buttonPushed ? <p>ボタンが押されました！</p> : null}
    </main>
  );
};

export default Profile;
