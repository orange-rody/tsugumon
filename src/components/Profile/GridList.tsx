import React, { useState } from "react";
import useFirestore from "../../hooks/useFirestore";
import styled from "styled-components";
import mediaQuery from "styled-media-query";
import DefaultButton from "../Parts/DefaultButton";

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
  height: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  padding-bottom: 60px;
  overflow: scroll;
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

const ButtonArea = styled.div`
  width: 200px;
  height: 40px;
  margin: 0 auto;
  padding: 0;
`;

const Grid: React.FC = () => {
  const [loadCount, setLoadCount] = useState<number>(0);

  const { posts, oldestId } = useFirestore(loadCount);
  console.log(posts);

  function showLoadButton() {
    if (posts.find((find) => find.id === oldestId)) {
      return (
        <ButtonArea>
          <p>最後まで読み込みました！</p>
        </ButtonArea>
      );
    } else {
      return (
        <ButtonArea>
          <DefaultButton
            child="更に読み込む"
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              setLoadCount((prev) => prev + 1);
            }}
            dataTestId="buttonForLoading"
            wide={true}
          />
        </ButtonArea>
      );
    }
  }

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
          {showLoadButton()}
        </PhotoList>
      </Main>
    </>
  );
};

export default Grid;
