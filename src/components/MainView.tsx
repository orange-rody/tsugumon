import React, { useState } from "react";
import styled from "styled-components";
import { auth } from "../firebase";
import CreatePost from "./CreatePost/CreatePost";
import Wrapper from "./Parts/Wrapper";
import PaperContainer from "./Parts/PaperContainer";
import {
  HomeRounded,
  SearchRounded,
  AddBoxRounded,
  NotificationsRounded,
  PersonRounded,
} from "@material-ui/icons";
import TabBar from "./Parts/TabBar";

const MainView = () => {
  const [element, setElement] = useState("Home");
  const signOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    auth.signOut();
  };
  const Element = () => {
    switch (element) {
      case "Home":
        return (
          <TabBar title="ホーム">
            <HomeRounded />
          </TabBar>
        );
      case "CreatePost":
        return <CreatePost />;
      default:
        return (
          <>
            <p>Home</p>
          </>
        );
    }
  };
  return (
    <Wrapper>
      <PaperContainer>
        <Element />
      </PaperContainer>
    </Wrapper>
  );
};

export default MainView;
