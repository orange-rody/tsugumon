import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { storage, db } from "../../firebase";
import Header from "../Parts/Header";
import IconButton from "../Parts/IconButton";
import InputFileButton from "../Parts/InputFileButton";
import ColorButton from "../Parts/ColorButton";
import styled from "styled-components";
import { makeStyles, createStyles, Theme } from "@material-ui/core";
import { Settings, NavigateBefore } from "@material-ui/icons";
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
    icon: {
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
  const userName = user.userName;
  const noUserIcon = `${process.env.PUBLIC_URL}/noUserIcon.png`;
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [userIconUrl, setUserIconUrl] = useState<string>(noUserIcon);
  const classes = useStyles();

  function FileRead(file: File) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
    });
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList: FileList | null = e.target.files;
    const file: File | null = fileList!.item(0);
    if (file) {
      FileRead(file)
        .then((response) => {
          setUserIconUrl(response as string);
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  return (
    <>
      {!editProfile ? (
        <div>
          <Header child={userName}>
            <IconButton
              onClick={(e: React.MouseEvent<HTMLElement>) =>
                console.log(user.userName)
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
              <UserName>{user.userName}</UserName>
              <ColorButton
                dataTestId="profileEditButton"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  setEditProfile(true)
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
            </UserNameSection>
          </Main>
        </div>
      ) : (
        <div>
          <Header child="プロフィールを編集する">
            <IconButton
              dataTestId="navigateBeforeButton"
              onClick={(e: React.MouseEvent) => {
                setEditProfile(false);
              }}
            >
              <NavigateBefore className={classes.icon} />
            </IconButton>
          </Header>
          <UserNameSection>
            <UserIconArea>
              <UserIcon src={userIconUrl} />
            </UserIconArea>
            <UserNameArea>
              <UserName>{user.userName}</UserName>
              <InputFileButton onChange={handleImage} />
            </UserNameArea>
          </UserNameSection>
        </div>
      )}
    </>
  );
};

export default Profile;