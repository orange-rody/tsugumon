import React from "react";
import { auth } from "../firebase";
import CreatePost from "./CreatePost/CreatePost";
const Feed = () => {
  const signOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    auth.signOut();
  };
  return (
    <div>
      <CreatePost />
    </div>
  );
};

export default Feed;
