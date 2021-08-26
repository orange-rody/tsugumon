import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { db, storage } from "../../firebase";
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

const Grid = () => {
  const user = useSelector(selectUser);
  const uid = user.uid;
  const userName = user.userName;
  const userIcon = user.userIcon;
  const noUserIcon = `${process.env.PUBLIC_URL}/noUserIcon.png`;
  const [posts, setPosts] = useState<
    {
      id: string;
      caption: string;
      imageUrl: string;
      timestamp: any;
      userName: string;
    }[]
  >([{ id: "", caption: "", imageUrl: "", timestamp: null, userName: "" }]);

  useEffect(() => {
    db.collection("posts")
      .where("uid", "==", uid)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            caption: doc.data().caption,
            imageUrl: doc.data().imageUrl,
            timestamp: doc.data().timestamp,
            userName: doc.data().userName,
            uid: doc.data().uid,
          }))
        );
      });
  }, [uid]);

  const lastLine = posts.length % 3;
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
          {posts.map((post, index) => {
            return (
              <PhotoItem style={{ backgroundColor: "gray" }} key={index}>
                <PhotoImage src={post.imageUrl} />
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
