import React, { ReactElement, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { storage, db } from "../../firebase";
// import firebase from "firebase/app";
import Header from "../Parts/Header";
// import ArrowBackButton from "../Parts/ArrowBackButton";
// import DefaultButton from "../Parts/DefaultButton";
// import SecondaryButton from "../Parts/SecondaryButton";
import IconButton from "../Parts/IconButton";
import ColorButton from "../Parts/ColorButton";
import styled from "styled-components";
import { makeStyles, createStyles, Theme, Slide } from "@material-ui/core";

import { Settings, Person } from "@material-ui/icons";
import mediaQuery from "styled-media-query";
import { setConstantValue } from "typescript";

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

const Main = styled.main`
  width: 30vw;
  ${mediaMobile`
    width: 100vw
  `};
  height: calc(100% - 103px);
  // background-color: yellow;
`;

const UserNameSection = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  padding-top: 40%;
  flex-flow: row;
`;

const UserIconArea = styled.div`
  width: 30%;
  position: absolute;
  top: 50%;
  left 0%;
  transform: translateY(-50%);
  padding-top: 30%;
`;

const UserIcon = styled.img`
  width: 75%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 100%;
  background-color: #ccc;
`;

const UserNameArea = styled.div`
  display: flex;
  width: 70%;
  position: absolute;
  padding-top: 30%;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  flex-flow: column;
  // background-color: orange;
`;

const UserName = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  width: 90%;
  position: absolute;
  margin: 0;
  top: 0%;
  left: 5%;
  font-size: 1.4rem;
  ${mediaMobile`
    font-size: 1.2rem
  `};
  overflow: hidden;
  color: #555;
  // background-color: pink;
`;

const Profile = () => {
  const user = useSelector(selectUser);
  const noUserIcon = `${process.env.PUBLIC_URL}/noUserIcon.png`;
  const [buttonPushed, setButtonPushed] = useState(false);
  const [userIconURL, setUserIconURL] = useState<string>(noUserIcon);
  const userName = user.userName;
  const classes = useStyles();

  function getUserIconURL() {
    storage
      .ref("userIcons")
      .child(`${user.uid} / userIcon.JPG`)
      .getDownloadURL()
      .then((url) => {
        setUserIconURL(url);
      });
  }
  return (
    <div onLoad={getUserIconURL}>
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
      <Main>
        <UserNameSection>
          <UserIconArea>
            <UserIcon src={userIconURL} />
          </UserIconArea>
          <UserNameArea>
            <UserName>
              {user.userName}
            </UserName>
            <ColorButton
              dataTestId="profileEditButton"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                console.log(userName)
              }
              child="編集する"
              color="primary"
              style={{
                position: "absolute",
                bottom: "0",
                left: "5%",
                width: "60%",
              }}
            ></ColorButton>
          </UserNameArea>
        </UserNameSection>
      </Main>
      {buttonPushed ? <p>ボタンが押されました！</p> : null}
    </div>
  );
};

export default Profile;
