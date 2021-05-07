import React from "react";
import { auth } from "../firebase";
import  PostInput from "../features/post/PostInput";
const Feed = () => {
  return (
    <div>
      Feed
      <PostInput />
      <button onClick={() => auth.signOut()}>Logout</button>
    </div>
  );
};

export default Feed;
