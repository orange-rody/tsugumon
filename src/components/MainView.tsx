import React, { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core";
import CreatePost from "./CreatePost/CreatePost";
import Profile from "./Profile/Profile";
import Wrapper from "./Parts/Wrapper";
import PaperContainer from "./Parts/PaperContainer";
import mediaQuery from "styled-media-query";
import {
  HomeRounded,
  SearchRounded,
  AddBoxRounded,
  NotificationsRounded,
  PersonRounded,
} from "@material-ui/icons";
import styled from "styled-components";

const mediaMobile = mediaQuery.lessThan("medium");

const TabDataLeft = [
  { value: "home", title: "ホーム", tabIcon: "HOME" },
  { value: "search", title: "検索", tabIcon: "SEARCH" },
];
const TabDataRight = [
  { value: "notification", title: "通知", tabIcon: "NOTIFICATION" },
  { value: "profile", title: "プロフィール", tabIcon: "PROFILE" },
];

const TabBox = styled.label`
  display: flex;
  margin: 0;
  width: 20%;
  height: 100%;
  margin: 0;
  padding: 0;
  flex-flow: column;
  list-style-type: none;
`;

const TabBoxAdd = styled(TabBox)`
  "&active":{
      backgroundColor: "#4fc0ad",
      color: "white",
      fontWeight: "bold",
      transitionProperty: "all",
      transitionDuration: "0.3s",
      transitionTimingFunction: "ease",
  }
`;

const TabTitle = styled.p`
  width: 100%;
  margin: 0;
  padding: 0;
  text-align: center;
  font-size: 10px;
`;
const iconStyle = { margin: "4px auto 0", padding: 0, fontSize: "30px" };
function getTabIcon(icon: string) {
  switch (icon) {
    case "HOME":
      return <HomeRounded style={iconStyle} />;
    case "SEARCH":
      return <SearchRounded style={iconStyle} />;
    case "ADD":
      return <AddBoxRounded style={iconStyle} />;
    case "NOTIFICATION":
      return <NotificationsRounded style={iconStyle} />;
    case "PROFILE":
      return <PersonRounded style={iconStyle} />;
  }
}

function getTabPanel(tab: string) {
  switch (tab) {
    case "home":
      return <div>home</div>;
    case "search":
      return <div>search</div>;
    case "notification":
      return <div>notification</div>;
    case "profile":
      return <Profile />;
    default:
      return <div>home</div>;
  }
}

const Tabs = styled.ul`
  display: flex;
  position: fixed;
  width: 30vw;
  ${mediaMobile`
    width: 100vw;
  `};
  height: 50px;
  margin: 0;
  padding: 0;
  bottom: 20px;
  ${mediaMobile`
    bottom: 0
  `};
  flex-flow: row;
  background-color: #fff;
  box-sizing: boreder-box;
  border-top: 1px solid silver;
  z-index: 999;
`;

const useStyles = makeStyles(() =>
  createStyles({
    selected: {
      backgroundColor: "#4fc0ad",
      color: "white",
      transitionProperty: "all",
      transitionDuration: "0.3s",
      transitionTimingFunction: "ease",
    },
    unselected: {
      color: "#555555",
    },
    show: {
      display: "block",
    },
    hidden: {
      display: "hidden",
    },
  })
);

const TabBar = () => {
  const [selectedTab, setSelectedTab] = useState("home");
  const [selectedAdd, setSelectedAdd] = useState(false);
  const classes = useStyles();

  return (
    <Wrapper data-testid="wrapper">
      <PaperContainer>
        <Tabs data-testid="tabs">
          {TabDataLeft.map((data) => {
            return (
              <TabBox
                className={
                  selectedTab === data.value
                    ? classes.selected
                    : classes.unselected
                }
                key={data.value}
                data-testid={data.value}
              >
                <input
                  type="radio"
                  name="tab"
                  style={{ appearance: "none" }}
                  value={data.value}
                  aria-label={data.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSelectedTab(data.value);
                  }}
                />
                {getTabIcon(data.tabIcon)}
                <TabTitle>{data.title}</TabTitle>
              </TabBox>
            );
          })}
          <TabBoxAdd
            onClick={(e: React.MouseEvent) => {
              setSelectedAdd(true);
            }}
            data-testid="add"
            style={{ color: "#555", marginTop: "2px" }}
          >
            <AddBoxRounded style={iconStyle} />
            <TabTitle>追加</TabTitle>
          </TabBoxAdd>
          {TabDataRight.map((data) => {
            return (
              <TabBox
                className={
                  selectedTab === data.value
                    ? classes.selected
                    : classes.unselected
                }
                data-testid={data.value}
                key={data.value}
              >
                <input
                  type="radio"
                  name="tab"
                  style={{ appearance: "none" }}
                  value={data.value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSelectedTab(data.value);
                  }}
                  aria-label={data.value}
                />
                {getTabIcon(data.tabIcon)}
                <TabTitle>{data.title}</TabTitle>
              </TabBox>
            );
          })}
        </Tabs>
        <CreatePost
          open={selectedAdd}
          closeAdd={(e: React.MouseEvent<HTMLElement>) => {
            setSelectedAdd(false);
          }}
        />
        {getTabPanel(selectedTab)}
      </PaperContainer>
    </Wrapper>
  );
};

export default TabBar;
