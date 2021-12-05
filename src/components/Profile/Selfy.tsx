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

const SingleItem = styled.li`
  width: 100%;
  margin: 0 auto;
  height: 600px;
  position: relative;
`;

const ImageWrap = styled.div`
  width: 100%;
  margin: 0 auto;
  position: relative;
  :before {
    content: "";
    display: block;
    padding-top: 90%;
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

const PostInfo = styled.div`
  width:100%;
  height: 80px;
  border: 1px;
  border-top: 1px solid silver;
  border-bottom: 1px solid silver;
`;

const CaptionArea = styled.div`
  width: 100%;
  height:   100px;
  border-bottom: 1px solid silver;
`;

const ButtonArea = styled.div`
  width: 200px;
  height: 40px;
  margin: 0 auto;
  padding: 0;
`;

const Grid: React.FC<{ selectedType: string }> = (props) => {
  interface Post {
    id: string;
    caption: string;
    imageUrl: string;
    timestamp: number;
    username: string;
  }

  const [loadCount, setLoadCount] = useState<number>(1);
  const { posts, oldestId } = useFirestore(loadCount);

  function showLoadButton() {
    if (posts.find((find: Post) => find.id === oldestId)) {
      return (
        <ButtonArea>
          {posts.length > 6 && <p>最後まで読み込みました！</p>}
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
        {props.selectedType === "grid" && (
          <List>
            {console.log(props.selectedType)}
            {posts.map((tile, index) => {
              return (
                <GridItem style={{ backgroundColor: "gray" }} key={index}>
                  <PhotoImage src={tile.imageUrl} />
                </GridItem>
              );
            })}
            {justifyLastLine()}
            {showLoadButton()}
          </List>
        )}
        {props.selectedType === "single" && (
          <List>
            {console.log(props.selectedType)}
            {posts.map((tile, index) => {
              return (
                <SingleItem style={{ backgroundColor: "gray" }} key={index}>
                  <ImageWrap>
                    <PhotoImage src={tile.imageUrl} />
                  </ImageWrap>
                  <PostInfo />
                  <CaptionArea />
                </SingleItem>
              );
            })}
            {showLoadButton()}
          </List>
        )}
      </Main>
    </>
  );
};

export default Grid;
