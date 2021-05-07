import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectPost } from "./postSlice";
import { newPost } from "./postSlice";
// import {auth} from "../firebase";
// import {Avatar} from "@material-ui/core";
// import {storage} from "../firebase";

const PostInput: React.FC = () => {
  const dispatch = useDispatch();
  const [editPhoto, setEditPhoto] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditPhoto(e.target.value);
    console.log(e.target.value);
  };
  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditCaption(e.target.value);
    console.log(e.target.value);
  };
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(newPost({ editPhoto, editCaption }));
    setEditPhoto("");
    setEditCaption("");
  };
  const post = useSelector(selectPost);

  // const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files![0]) {
  //     setImage(e.target.files![0]);
  //     e.target.value = "";
  //   }
  // };
  // const submitImage = () => {
  //   if(Image){
  //     const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  //     const N = 16;
  //     const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n)=>S[n % S.length]).join("");
  //     const fileName = randomChar + "_" + Image.name;
  //     storage.ref(`${user.uid}/${fileName}`).put(Image);
  //     let url = storage.ref(`${user.uid}`).child(`${fileName}`).getDownloadURL();
  //   }
  // }
  return (
    <div>
      <input type="file" onChange={handlePhotoChange}></input>
      <input type="text" onChange={handleCaptionChange}></input>
      {post.caption}
      <input type="button" onClick={handleSubmit} value="投稿する"/>
    </div>
  );
};

export default PostInput;
