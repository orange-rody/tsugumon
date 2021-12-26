import React, { useState } from "react";
import useRecent from "../../hooks/useRecent";
import styled from "styled-components";
import mediaQuery from "styled-media-query";
import Btn from "../Parts/Button";

const mediaMobile = mediaQuery.lessThan("medium");

const Main = styled.main`
  width: 100%;
  height: 100%;
  z-index: 6;
`;

const List = styled.ul`
  display: flex;
  width: 30vw;
  ${mediaMobile`
    width: 100%;
  `}
  height: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0;
  padding: 0 0 60px 0;
  overflow: scroll;
  list-style: none;
`;

const GridItem = styled.li`
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
  left: 0;
  object-fit: cover;
`;

const ButtonArea = styled.div`
  width: 200px;
  height: 30px;
  margin: 10px auto;
  padding: 0;
`;

const Grid: React.FC<{ word: string }> = (props) => {
  interface Post {
    id: string;
    caption: string;
    imageUrl: string;
    timestamp: number;
    username: string;
  }

  const [loadCount, setLoadCount] = useState<number>(1);
  const { posts, oldestId } = useRecent(props.word, loadCount);

  function showLoadButton() {
    if (posts.find((find: Post) => find.id === oldestId)) {
      return (
        <ButtonArea>
          <p>最後まで読み込みました!</p>
        </ButtonArea>
      );
    } else if (posts.length > 20) {
      return (
        <ButtonArea>
          {posts.length >= 6 && <p>読み込み数の上限に到達しました!</p>}
        </ButtonArea>
      );
    } else {
      return (
        <ButtonArea>
          <Btn
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              setLoadCount((prev) => prev + 1);
            }}
            dataTestId="load"
            style={{ width: "180px" }}
            variant="outlined"
          >
            更に読み込む
          </Btn>
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
            <GridItem />
            <GridItem />
          </>
        );
      case 2:
        return <GridItem />;
    }
  }

  return (
    <>
      <Main>
        <List>
          {posts.map((tile) => {
            return (
              <GridItem style={{ backgroundColor: "gray" }} key={tile.id}>
                <PhotoImage src={tile.imageUrl} />
              </GridItem>
            );
          })}
          {justifyLastLine()}
          {showLoadButton()}
        </List>
      </Main>
    </>
  );
};

export default Grid;
