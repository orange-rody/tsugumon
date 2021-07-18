import React, { ReactElement, useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core";
import {
  HomeRounded,
  SearchRounded,
  AddBoxRounded,
  NotificationsRounded,
  PersonRounded,
} from "@material-ui/icons";
import styled from "styled-components";

const Tabs = styled.ul`
  display: flex;
  width: 100%;
  height: 52px;
  position: absolute;
  bottom: 0;
  flex-dlow: row;
  background-color: hsl(0, 0, 100%);
  bordertop: 1px solid hsl(0, 0, 40%);
`;
const Tab = styled.li`
  display: flex;
  flex-flow: column;
  width: 20%;
  height: 100%;
  margin: 0;
  padding: 0;
  list-style-type: none;
`;
const TabTitle = styled.p`
  width: 100%;
  height: 26px;
  text-align: center;
  font-size: 15px;
`;

const useStyles = makeStyles(() =>
  createStyles({
    selected: {
      backgroundColor: "#4fc0ad",
      color: "white",
    },
    unselected: {
      backgroundColor: "hsl(0,0,100%)",
      color: "hsl(0,0,20%)",
    },
  })
);

const TabBar = () => {
  const [selectedTab, setSelectedTab] = useState("home");
  const classes = useStyles();
  return (
    <Tabs>
      <Tab
        value="home"
        onClick={(e: React.MouseEvent) => setSelectedTab("home")}
        className={
          selectedTab === "home" ? classes.selected : classes.unselected
        }
      >
        <HomeRounded
          className={
            selectedTab === "home" ? classes.selected : classes.unselected
          }
        />
        <TabTitle
          className={
            selectedTab === "home" ? classes.selected : classes.unselected
          }
        >
          ホーム
        </TabTitle>
      </Tab>
      <Tab
        value="search"
        onClick={(e: React.MouseEvent) => setSelectedTab("search")}
        className={
          selectedTab === "search" ? classes.selected : classes.unselected
        }
      >
        <SearchRounded
          className={
            selectedTab === "search" ? classes.selected : classes.unselected
          }
        />
        <TabTitle
          className={
            selectedTab === "search" ? classes.selected : classes.unselected
          }
        >
          検索
        </TabTitle>
      </Tab>
      <Tab
        value="add"
        onClick={(e: React.MouseEvent) => setSelectedTab("add")}
        className={
          selectedTab === "add" ? classes.selected : classes.unselected
        }
      >
        <AddBoxRounded
          className={
            selectedTab === "add" ? classes.selected : classes.unselected
          }
        />
        <TabTitle
          className={
            selectedTab === "add" ? classes.selected : classes.unselected
          }
        >
          追加
        </TabTitle>
      </Tab>
      <Tab
        value="notification"
        onClick={(e: React.MouseEvent) => setSelectedTab("notification")}
        className={
          selectedTab === "notification" ? classes.selected : classes.unselected
        }
      >
        <NotificationsRounded
          className={
            selectedTab === "notification"
              ? classes.selected
              : classes.unselected
          }
        />
        <TabTitle
          className={
            selectedTab === "notification"
              ? classes.selected
              : classes.unselected
          }
        >
          通知
        </TabTitle>
      </Tab>
      <Tab
        value="profile"
        onClick={(e: React.MouseEvent) => setSelectedTab("profile")}
        className={
          selectedTab === "profile" ? classes.selected : classes.unselected
        }
      >
        <PersonRounded
          className={
            selectedTab === "profile" ? classes.selected : classes.unselected
          }
        />
        <TabTitle
          className={
            selectedTab === "profile" ? classes.selected : classes.unselected
          }
        >
          プロフィール
        </TabTitle>
      </Tab>
    </Tabs>
  );
};

export default TabBar;
