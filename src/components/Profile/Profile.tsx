import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import EditProfile from "./EditProfile";
import Header from "../Parts/Header";
import IconButton from "../Parts/IconButton";
import ColorButton from "../Parts/Button";
import Selfy from "./MyPost";
import styled from "styled-components";
import { makeStyles, createStyles, Theme } from "@material-ui/core";
import {
  Settings,
  ViewComfy,
  ViewDay,
  LocalOffer,
  DateRange,
} from "@material-ui/icons";
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
    selected: {
      color: "#50a0d0",
      transitionProperty: "all",
      transitionDuration: "0.3s",
      transitionTimingFunction: "ease",
    },
    unselected: {
      color: "#ccc",
    },
  })
);

const iconStyle = { margin: "4px auto 0", padding: 0, fontSize: "25px" };

const DisplayTypeData = [
  { value: "grid", title: "小さく表示", icon: "GRID" },
  { value: "single", title: "大きく表示", icon: "SINGLE" },
  { value: "tag", title: "タグ", icon: "TAG" },
  { value: "calendar", title: "カレンダー", icon: "CALENDAR" },
];

function getDisplayTypeIcon(icon: string) {
  switch (icon) {
    case "GRID":
      return <ViewComfy style={iconStyle} />;
    case "SINGLE":
      return <ViewDay style={iconStyle} />;
    case "TAG":
      return <LocalOffer style={iconStyle} />;
    case "CALENDAR":
      return <DateRange style={iconStyle} />;
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Main = styled.main`
  width: 30vw;
  ${mediaMobile`
    width: 100vw
  `};
`;

const Title = styled.div`
  width: 90%;
  height: 52px;
  font-size: 16px;
  line-height: 52px;
  color: hsl(0, 0%, 10%);
  font-weight: bold;
  letter-spacing: 2px;
`;

const UserNameSection = styled.div`
  display: flex;
  position: relative;
  width: 90%;
  height: 120px;
  margin: 0 auto;
  flex-flow: row;
  color: rgba(0, 0, 0, 0.87);
`;

const IntroductionSection = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  border-top: 1px solid silver;
  border-bottom: 1px solid silver;
  margin-top: 15px;
`;

const Introduction = styled(UserNameSection)`
  position: relative;
  width: 25rem;
  ${mediaMobile`
    width: 90%;
  `}
  padding: 5px;
  height: 120px;
  margin: 10px auto;
  overflow: hidden;
`;

const UserIcon = styled.img`
  width: 80px;
  height: 80px;
  margin: 20px 10px 10px 10px;
  border-radius: 100%;
`;

const UserNameArea = styled.div`
  width: 100%;
`;

const UserName = styled.p`
  display: block;
  width: 90%;
  height: 30px;
  margin-top: 20px;
  font-size: 1.2rem;
  overflow: hidden;
  color: #555;
  margin-bottom: 0px;
  ${mediaMobile`
    font-size: 1.2rem 
  `};
`;

const Prefecture = styled.p`
  display: inline-block;
  height: 15px;
  margin: 0px 10px 15px 0px;
  color: #006152;
  font-size: 0.8rem;
`;

const Job = styled.p`
  display: inline-block;
  width: calc(90% - 40px);
  height: 15px;
  margin: 0px;
  color: #006152;
  font-size: 0.8rem;
`;

const DisplayTypeList = styled.ul`
  display: flex;
  width: 100%;
  height: 50px;
  margin: 0;
  padding: 0;
  flex-direction: row;
  border-bottom: 1px solid silver;
`;

const DisplayType = styled.label`
  display: flex;
  width: 25%;
  height: 60px;
  margin: 0;
  flex-direction: column;
  box-sizing: border-box;
`;

const DisplayTypeName = styled.p`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  text-align: center;
  font-size: 0.6rem;
`;

const Profile: React.FC = () => {
  console.log("Profileがレンダリングされました。");
  const user = useSelector(selectUser);
  const { username, userIcon, prefecture, job, introduction } = user;
  const [selectedType, setSelectedType] = useState<string>("grid");
  const [edit, setEdit] = useState<boolean>(false);

  const noUserIcon = `${process.env.PUBLIC_URL}/noUserIcon.png`;
  const classes = useStyles();

  function openEdit() {
    console.log("openEditが呼ばれました。");
    setEdit(true);
    console.log(edit);
  }
  function closeEdit() {
    setEdit(false);
  }

  return (
    <>
      {" "}
      {!edit ? (
        <Wrapper>
          <Header style={{ display: "flex", zIndex: 3 }}>
            <IconButton
              onClick={(e: React.MouseEvent<HTMLElement>) =>
                console.log(username)
              }
              dataTestId="settings"
            >
              <Settings className={classes.settingIcon} />
            </IconButton>
            <Title>{username ? username : "匿名のユーザー"}</Title>
          </Header>
          <div style={{ width: "100%", height: "52px", margin: "0px" }} />
          <Main>
            <UserNameSection>
              <UserIcon src={userIcon === "" ? noUserIcon : userIcon} />
              <UserNameArea>
                <UserName>{username ? username : "匿名のユーザー"}</UserName>
                <Prefecture>{prefecture ? prefecture : ""}</Prefecture>
                <Job>{job ? job : ""}</Job>
                <ColorButton
                  dataTestId="profileEditButton"
                  onClick={openEdit}
                  color="primary"
                  style={{
                    left: "10px",
                    width: "150px",
                  }}
                  variant="contained"
                >
                  編集する
                </ColorButton>
              </UserNameArea>
            </UserNameSection>
            <IntroductionSection>
              <Introduction>{introduction}</Introduction>
            </IntroductionSection>
            <DisplayTypeList>
              {DisplayTypeData.map((data) => {
                return (
                  <DisplayType
                    className={
                      selectedType === data.value
                        ? classes.selected
                        : classes.unselected
                    }
                    key={data.value}
                    data-testid={data.value}
                  >
                    {getDisplayTypeIcon(data.icon)}
                    <input
                      type="radio"
                      name="type"
                      style={{ appearance: "none" }}
                      value={data.value}
                      aria-label={data.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSelectedType(data.value);
                        console.log(data.value);
                      }}
                    />
                    <DisplayTypeName>{data.title}</DisplayTypeName>
                  </DisplayType>
                );
              })}
            </DisplayTypeList>
            {selectedType === "grid" && <Selfy selectedType="grid" />}
            {selectedType === "single" && <Selfy selectedType="single" />}
            {selectedType === "tag" && <div></div>}
            {selectedType === "calendar" && <div></div>}
          </Main>
        </Wrapper>
      ) : (
        <EditProfile closeEdit={closeEdit} />
      )}
    </>
  );
};
export default Profile;
