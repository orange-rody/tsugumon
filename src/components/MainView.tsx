import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { auth } from "../firebase";
import CreatePost from "./CreatePost/CreatePost";
import Wrapper from "./Parts/Wrapper";
import PaperContainer from "./Parts/PaperContainer";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  HomeRounded,
  SearchRounded,
  AddBoxRounded,
  NotificationsRounded,
  Person,
} from "@material-ui/icons";

interface TabPanelProps {
  children?: JSX.Element;
  index: string;
  value: string;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, index, value, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabPanel-${index}`}
      aria-labelledby={index}
      {...other}
    >
      {value === index && children}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const MainView = () => {
  const [value, setValue] = useState("home");
  const classes = useStyles();
  const handleChange = (e: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Wrapper>
        <PaperContainer>
          <AppBar position="fixed" color="default">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              aria-label="tabs"
            >
              <Tab
                label="ホーム"
                icon={<HomeRounded />}
                value="home"
                aria-controls="tabPanel-home"
              />
              <Tab
                label="検索"
                icon={<SearchRounded />}
                value="search"
                aria-controls="tabPanel-search"
              />
              <Tab
                label="追加"
                icon={<AddBoxRounded />}
                value="add"
                aria-controls="tabPanel-add"
              />
              <Tab
                label="通知"
                icon={<NotificationsRounded />}
                value="notification"
                aria-controls="tabPanel-notification"
              />
              <Tab
                label="プロフィール"
                icon={<Person />}
                value="profile"
                aria-controls="profile-notification"
              />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index="home">
            <p>Home</p>
          </TabPanel>
          <TabPanel value={value} index="search">
            <p>Search</p>
          </TabPanel>
          <TabPanel value={value} index="add">
            <CreatePost />
          </TabPanel>
          <TabPanel value={value} index="notification">
            <p>Notification</p>
          </TabPanel>
          <TabPanel value={value} index="profile">
            <p>Profile</p>
          </TabPanel>
        </PaperContainer>
      </Wrapper>
    </div>
  );
};

export default MainView;