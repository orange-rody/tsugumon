import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  createStyles,
  createMuiTheme,
  BottomNavigation,
  BottomNavigationAction,
  ThemeProvider,
} from "@material-ui/core";
import { auth } from "../firebase";
import CreatePost from "./CreatePost/CreatePost";
import Wrapper from "./Parts/Wrapper";
import PaperContainer from "./Parts/PaperContainer";

import {
  HomeRounded,
  SearchRounded,
  AddBoxRounded,
  NotificationsRounded,
  Person,
} from "@material-ui/icons";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#4fc0ad",
      main: "#008f7e",
      dark: "#006152",
      contrastText: "#fff",
    },
    secondary: {
      light: "#50a0d0",
      main: "#00729f",
      dark: "#004770",
      contrastText: "#fff",
    },
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selected: {
      position: "absolute",
      width: "100%",
      height: "50px",
      bottom: 0,
      backgroundColor: "blue",
    },
  })
);

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
      hidden={index !== value}
      id={`tabPanel-${index}`}
      {...other}
    >
      {value === index && { children }}
    </div>
  );
};

const MainView = () => {
  const [value, setValue] = useState("home");
  const classes = useStyles();
  const handleChange = (e: React.ChangeEvent<{}>, newValue: string) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Wrapper>
        <PaperContainer>
          <BottomNavigation
            value={value}
            onChange={handleChange}
            className={classes.selected}
            showLabels
          >
            <BottomNavigationAction
              label="ホーム"
              icon={<HomeRounded />}
              value="home"
            />
            <BottomNavigationAction
              label="検索"
              icon={<SearchRounded />}
              value="search"
            />
            <BottomNavigationAction
              label="追加"
              icon={<AddBoxRounded />}
              value="add"
            />
            <BottomNavigationAction
              label="通知"
              icon={<NotificationsRounded />}
              value="notification"
            />
            <BottomNavigationAction
              label="プロフィール"
              icon={<Person />}
              value="profile"
            />
          </BottomNavigation>
        </PaperContainer>
      </Wrapper>
    </ThemeProvider>
  );
};

export default MainView;
