import React, { useState } from "react";
import { auth } from "../firebase";
import CreatePost from "./CreatePost/CreatePost";
import TabBar from "./Parts/TabBar";
import Wrapper from "./Parts/Wrapper";
import PaperContainer from "./Parts/PaperContainer";

const Feed = () => {
  const [element, setElement] = useState("CreatePost");
  const signOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    auth.signOut();
  };
  const Element = () => {
    switch (element) {
      case "empty":
        return <p>Empty</p>;
      case "CreatePost":
        return <CreatePost />;
      default:
        return <p>Empty</p>;
    }
  };
  return (
    <Wrapper>
      <PaperContainer>
        <Element />
        <TabBar/>
      </PaperContainer>
    </Wrapper>
  );
};

export default Feed;
