import React, { useState } from "react";
import { auth } from "../firebase";
import CreatePost from "./CreatePost/CreatePost";
import TabBar from "./Parts/TabBar";
import Wrapper from "./Parts/Wrapper";
import PaperContainer from "./Parts/PaperContainer";

const MainView = () => {

  return (
      <Wrapper>
        <PaperContainer>
          <TabBar />
        </PaperContainer>
      </Wrapper>
    
  );
};

export default MainView;