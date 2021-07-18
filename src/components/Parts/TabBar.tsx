import React, { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core";
import {
  HomeRounded,
  SearchRounded,
  AddBoxRounded,
  NotificationsRounded,
  PersonRounded,
} from "@material-ui/icons";
import styled from "styled-components";

const TabData = [
  { value: "home", title: "ホーム", tabIcon: "HOME" },
  { value: "search", title: "検索", tabIcon: "SEARCH" },
  { value: "add", title: "追加", tabIcon: "ADD" },
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

const TabTitle = styled.p`
  width: 100%;
  margin: 0;
  padding: 0;
  text-align: center;
  font-size: 10px;
  color: hsl(0, 0, 20%);
`;
function getTabIcon(icon: string) {
  const iconStyle = { margin: "4px auto 0", padding: 0, fontSize: "30px" };
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

const Tabs = styled.ul`
  display: flex;
  width: 100%;
  height: 50px;
  margin: 0;
  padding: 0;
  position: absolute;
  bottom: 0;
  flex-flow: row;
  background-color: hsl(0, 0, 100%);
  border-top: 1px solid rgb();
`;

const useStyles = makeStyles(() =>
  createStyles({
    selected: {
      backgroundColor: "#4fc0ad",
      color: "white",
      transition: "all 0.3s",
    },
    unselected: {
      color: "hsl(0,0,20%)",
    },
  })
);

const TabBar = () => {
  const [selectedTab, setSelectedTab] = useState("home");
  const classes = useStyles();

  return (
    <Tabs>
      {TabData.map((data) => {
        return (
          <TabBox
            className={
              selectedTab === data.value ? classes.selected : classes.unselected
            }
          >
            <input
              type="radio"
              name="tab"
              value={data.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSelectedTab(data.value);
              }}
            />
            {getTabIcon(data.tabIcon)}
            <TabTitle>{data.title}</TabTitle>
          </TabBox>
        );
      })}
      ;
    </Tabs>
  );
};

export default TabBar;
