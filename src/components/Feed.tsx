import React from "react";
import { auth } from "../firebase";
import ImageInput from "../components/ImageInput/ImageInput";
const Feed = () => {
  const signOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    auth.signOut();
  };
  return (
    <div>
      <ImageInput />
    </div>
  );
};

export default Feed;
