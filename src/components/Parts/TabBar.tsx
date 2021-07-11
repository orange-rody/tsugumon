import React from "react";
// import {
//   createStyles,makeStyles,Theme,ThemeProvider
// } from "@material-ui/icons";
import styled from "styled-components";
import {
  HomeRounded,
  SearchRounded,
  AddBoxRounded,
  NotificationsRounded,
  PersonRounded,
} from "@material-ui/icons";

const TabBarContainer = styled.div`
  width: 100%;
  height: 49px;
  display: flex;
  flex-flow: row;
  border-top: hsl(0, 0, 80%);
`;

const TabBar = () => {
  // const [active, setActive] = useState("home");
  const Home = styled.div`
    width: 20%;
    height: 100%;
  `;
  const Search = styled(Home)`
    color: hsl(0, 0, 20%);
  `;

  const Add = styled(Home)`
    color: hsl(0, 0, 20%);
  `;

  const Notification = styled(Home)`
    color: hsl(0, 0, 20%);
  `;

  const Profile = styled(Home)`
    color: hsl(0, 0, 20%);
  `;

  return (
    <TabBarContainer>
      <Home>
        <HomeRounded />
      </Home>
      <Search>
        <SearchRounded />
      </Search>
      <Add>
        <AddBoxRounded />
      </Add>
      <Notification>
        <NotificationsRounded />
      </Notification>
      <Profile>
        <PersonRounded />
      </Profile>
    </TabBarContainer>
  );
};

export default TabBar;
