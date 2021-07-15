import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  HomeRounded,
  SearchRounded,
  AddBoxRounded,
  NotificationsRounded,
  PersonRounded,
} from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function TabsButton() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          {/* NOTE >> Tabコンポーネントではchilderenがサポートされていない。
                      そのため、タブに表示する内容はlabelとiconで指定することとなる */}
          {/* NOTE >> Tabコンポーネント上で関数tabPropsを展開することで、必要なpropsを
                      Tabコンポーネントに渡している。*/}
          <Tab
            id="home"
            data-testid="home"
            label="Home"
            icon={<HomeRounded />}
          />
          <Tab
            id="search"
            data-testid="search"
            label="Search"
            icon={<SearchRounded />}
          />
          <Tab
            id="post"
            data-testid="post"
            label="Post"
            icon={<AddBoxRounded />}
          />
          <Tab
            id="notification"
            data-testid="notification"
            label="Notification"
            icon={<NotificationsRounded />}
          />
          <Tab
            id="profile"
            data-testid="profile"
            label="Profile"
            icon={<PersonRounded />}
          />
        </Tabs>
      </AppBar>
    </div>
  );
}
