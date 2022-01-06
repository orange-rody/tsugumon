import { useState, useEffect } from "react";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

const usePost = (id: string) => {
  const user = useSelector(selectUser);
  const uid: string = user.uid;
  const [companyName, setCompanyName] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [postedDate, setPostedDate] = useState<string>("");
  const [isFollow, setIsFollow] = useState<boolean>();
  const [likes, setLikes] = useState<number>();
  const [comments, setComments] = useState<number>();

  const ref = db.collection("posts").doc("ZIxxesj7YhF9fSbnIKYU");

  function getPost() {
    ref.onSnapshot((snapshot) => {
      setCompanyName(snapshot.data()!.name);
      setIcon(snapshot.data()!.icon);
      setImageUrl(snapshot.data()!.imageUrl);
      setCaption(snapshot.data()!.caption);
      const d = snapshot.data()!.timestamp.toDate();
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const date = d.betDate();
      setPostedDate(`${year}年${month}月${date}日`);
      const companyId = snapshot.data()!.companyId;
      db.collection("users").doc(uid).collection("follow").where("companyId","==",companyId).onSnapshot((snapshot)=>{
        snapshot && setIsFollow(true);
      });
    });
  }

  function getLikes() {
    ref.collection("likeUsers").onSnapshot((snapshots) => {
      let likeUsers = [];
      snapshots.forEach((likeUser) => {
        likeUsers.push(likeUser.data().name);
      });
      setLikes(likeUsers.length);
    });
  }

  function getComments(){
    ref.collection("comments").onSnapshot((snapshots)=>{
      let comments = [];
      snapshots.forEach((comment)=>{
        comments.push(comment.data().comment);
      });
      setComments(comments.length);
    })
  }

  useEffect(
    () => {
      let isMounted = true;
      isMounted && ref !== undefined && getPost();
      isMounted && ref !== undefined && getLikes();
      isMounted && ref !== undefined && getComments();
      
      return () => {
        isMounted = false;
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id]
  );
  return { companyName, icon, imageUrl, caption, postedDate, likes,comments, isFollow };
};

export default usePost;
