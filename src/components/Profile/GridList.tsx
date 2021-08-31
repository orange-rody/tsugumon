import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { selectPost, load } from "../../features/postSlice";
import { db } from "../../firebase";
import InfinitScroll from "react-infinite-scroller";
import styled from "styled-components";
import mediaQuery from "styled-media-query";

const mediaMobile = mediaQuery.lessThan("medium");

const Main = styled.main`
  width: 100%;
  height: 100%;
  z-index: 6;
`;

const PhotoList = styled.ul`
  display: flex;
  width: 30vw;
  ${mediaMobile`
    width: 100%;
  `}
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  margin-bottom: 60px;
  list-style: none;
`;

const PhotoItem = styled.li`
  width: 33%;
  margin-bottom: 2px;
  position: relative;
  &:before {
    content: "";
    display: block;
    padding-top: 100%;
  }
`;

const PhotoImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0:
  object-fit: cover;
`;

const Grid: React.FC = () => {
  const user = useSelector(selectUser);
  const post = useSelector(selectPost);
  const dispatch = useDispatch();
  const uid = user.uid;
  const currentTime = new Date().getTime();

  // NOTE >> 過去の投稿（20件）を読み込む関数を定義する。
  const postLoader = (currentTime: number) => {
    db.collection("posts")
      .where("uid", "==", uid)
      .orderBy("timestamp", "desc")
      // .startAfter(currentTime)
      .limit(20)
      .onSnapshot((snapshot) => {
        dispatch(
          load(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              caption: doc.data().caption,
              imageUrl: doc.data().imageUrl,
              timestamp: doc.data().timestamp.seconds,
              userName: doc.data().userName,
              uid: doc.data().uid,
            }))
          )
        );
      });
  };

  useEffect(() => {
    postLoader(currentTime);
  });

  const lastLine = post.length % 3;
  function justifyLastLine() {
    switch (lastLine) {
      case 0:
        break;
      case 1:
        return (
          <>
            <PhotoItem />
            <PhotoItem />
          </>
        );
      case 2:
        return <PhotoItem />;
    }
  }

  return (
    <>
      <Main>
        <PhotoList>
          {post.map((item, index) => {
            return (
              <PhotoItem style={{ backgroundColor: "gray" }} key={index}>
                <PhotoImage src={item.imageUrl} />
              </PhotoItem>
            );
          })}
          {justifyLastLine()}
        </PhotoList>
      </Main>
    </>
  );
};

export default Grid;
