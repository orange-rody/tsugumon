import React, { useState } from "react";
import useFirestore from "../../hooks/useFirestore";
import styled from "styled-components";
import mediaQuery from "styled-media-query";
import Btn from "../Parts/Button";
import {
  FavoriteRounded,
  ChatRounded,
  SendRounded,
  ArrowDropDownRounded,
} from "@material-ui/icons";

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

const SingleItem = styled.div`
  width: 100%;
  height: calc(100vh -52px -51px);
  margin: 0 auto;
  position: relative;
`;

const PhotoBox = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-top: 1px solid silver;
`;

const PhotoImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
`;

const PostStatus = styled.div`
  display: flex;
  width: 100%;
  height: 10vh;
  margin: 0 auto;
  position: relative;
  flex-flow: row;
  justify-content: space-around;
  border: 1px;
  border-top: 1px solid silver;
  border-bottom: 1px solid silver;
`;

const Box = styled.div`
  padding-top: 2%;
  width: 33%;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
`;

const CountBox = styled.div`
  height: 70%;
  width: 40%;
  margin: 0;
  padding: 0;
`;

const Count = styled.p`
  display: inline-block;
  width: 100%;
  font-size: 1rem;
  margin-left: 0;
  margin-top: 0;
  padding: 0;
  text-align: left;
  vertical-align: text-top;
`;

const Title = styled.p`
  height: 25%;
  margin-top: 2%;
  margin-bottom: 3%;
  text-align: center;
  font-size: 0.8rem;
  ${mediaMobile`
  font-size: 0.6rem;
`}
`;

const CaptionArea = styled.div<CustomProps>`
  width: 100%;
  height: ${(props) => (props?.include ? "100%" : "30vh")};
  margin: 0 auto;
  position: relative;
  border: 1px;
  vertical-align: top;
`;

const Caption = styled.p`
  width: 90%;
  height: 90%;
  margin: 2% auto;
  overflow: hidden;
  color: transparent;
  background: linear-gradient(180deg, rgb(0, 0, 0) 60%, #fff 100%);
  -webkit-background-clip: text;
`;

const ButtonArea = styled.div`
  width: 200px;
  height: 30px;
  margin: 10px auto;
  padding: 0;
`;

// 独自定義のプロパティ
type CustomProps = {
  include?: boolean;
};

const Grid: React.FC<{ selectedType: string }> = (props) => {
  interface Post {
    id: string;
    caption: string;
    imageUrl: string;
    timestamp: number;
    username: string;
  }

  const [loadCount, setLoadCount] = useState<number>(1);
  const [extended, setExtended] = useState<string[]>([]);
  const { posts, oldestId } = useFirestore(loadCount);

  function showLoadButton() {
    if (posts.find((find: Post) => find.id === oldestId)) {
      console.log("最後まで読み込みました。");
      return (
        <ButtonArea>
          {posts.length >= 6 && <p>最後まで読み込みました！</p>}
        </ButtonArea>
      );
    } else {
      console.log("更に読み込みできます。");
      return (
        <ButtonArea>
          <Btn
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              setLoadCount((prev) => prev + 1);
            }}
            dataTestId="load"
            style={{width: "180px"}}
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

  function extendCaption(targetId: string) {
    [...extended].includes(targetId)
      ? setExtended([...extended].filter((id) => id !== targetId))
      : setExtended([...extended, targetId]);
  }

  return (
    <>
      <Main>
        {props.selectedType === "grid" && (
          <List>
            {console.log(props.selectedType)}
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
        )}
        {props.selectedType === "single" && (
          <List>
            {console.log(props.selectedType)}
            {posts.map((tile, index) => {
              return (
                <SingleItem key={tile.id} id={tile.id}>
                  <PhotoBox>
                    <PhotoImage src={tile.imageUrl} />
                  </PhotoBox>
                  <PostStatus>
                    <Box>
                      <Title>いいね！</Title>
                      <Container>
                        <FavoriteRounded
                          style={{
                            display: "inline-block",
                            width: "50%",
                            fontSize: "30px",
                            textAlign: "center",
                            lineHeight: "75%",
                            color: "#4fc0ad",
                          }}
                        />
                        <CountBox>
                          <Count>9999</Count>
                        </CountBox>
                      </Container>
                    </Box>
                    <Box>
                      <Title>コメント</Title>
                      <Container>
                        <ChatRounded
                          style={{
                            display: "inline-block",
                            width: "50%",
                            fontSize: "30px",
                            textAlign: "center",
                            lineHeight: "75%",
                            color: "#4fc0ad",
                          }}
                        />
                        <CountBox>
                          <Count>9999</Count>
                        </CountBox>
                      </Container>
                    </Box>
                    <Box>
                      <Title>メッセージ</Title>
                      <Container>
                        <SendRounded
                          style={{
                            display: "inline-block",
                            width: "50%",
                            fontSize: "30px",
                            textAlign: "center",
                            lineHeight: "75%",
                            color: "#4fc0ad",
                          }}
                        />
                        <CountBox>
                          <Count>9999</Count>
                        </CountBox>
                      </Container>
                    </Box>
                  </PostStatus>
                  <CaptionArea
                    include={
                      [...extended].includes(tile.id) &&
                      tile.caption.length > 100
                        ? true
                        : false
                    }
                    onClick={() => {
                      extendCaption(tile.id);
                      console.log(tile.caption.length);
                    }}
                  >
                    <Caption>{tile.caption}</Caption>
                    <p style={{ margin: "0 auto", width: "5%" }}>
                      {[...extended].includes(tile.id) ||
                      tile.caption.length <= 100 ? (
                        ""
                      ) : (
                        <ArrowDropDownRounded
                          style={{
                            color: "gray",
                            position: "absolute",
                            bottom: "0",
                          }}
                        />
                      )}
                    </p>
                  </CaptionArea>
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
