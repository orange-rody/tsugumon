import React, { useState } from "react";
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

const Main = styled.main`
  width: 100%;
  height: calc(100% - 103px);
  background-color: yellow;
`;

const UserNameSection = styled.div`
  display: flex;
  width: 100%;
  height: 180px;
  flex-flow: row;
  background-color: blue;
`;

const UserIconArea = styled.div`
  width: 180px;
  height: 180px;
  background-color: skyblue;
`;

const UserIcon = styled.div`
  width: 120px;
  height: 120px;
  margin: 30px auto;
  border-radius: 100%;
  background-color: white;
`;

const UserNameArea = styled.div`
  display: flex;
  width: calc(100% - 180px);
  height: 100%;
  flex-flow: column;
  background-color: yellowgreen;
`;

const UserName = styled.p`
  width: calc(100% - 40px);
  height: 50px;
  margin: 20px;
  font-size: 2rem;
  color: #555;
  background-color: pink;
`;

const Profile = () => {
  const user = useSelector(selectUser);
  const userIconRef = storage.ref("userIcons").child(user.uid);

  const [buttonPushed, setButtonPushed] = useState(false);
  const userName = user.userName;
  const classes = useStyles();
  return (
    <>
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
            <UserIcon />
          </UserIconArea>
          <UserNameArea>
            <UserName></UserName>
            <ColorButton
              dataTestId="profileEdit"
              onClick={(e: React.MouseEvent) => {
                console.log("ボタンが押されました！");
              }}
              color="primary"
              child="プロフィールを編集する"
              style={{ width: "250px", marginLeft: "20px" }}
            />
          </UserNameArea>
        </UserNameSection>
      </Main>
      {buttonPushed ? <p>ボタンが押されました！</p> : null}
    </>
  );
};

export default Profile;
