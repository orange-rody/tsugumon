import React from "react";
import { auth } from "../firebase";
import ImageInput from "../components/ImageInput/ImageInput";
const Feed = () => {
  return (
    <div>
      Feed
      <ImageInput />
      <button onClick={() => auth.signOut()}>Logout</button>
    </div>
  );
};

export default Feed;
