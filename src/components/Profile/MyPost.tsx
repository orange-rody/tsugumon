import React, { useState } from "react";
import useFirestore from "../../hooks/useFirestore";
import styled from "styled-components";
import mediaQuery from "styled-media-query";
import DefaultButton from "../Parts/DefaultButton";
import { FavoriteRounded, ChatRounded, SendRounded } from "@material-ui/icons";

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
  left: 0;
  object-fit: cover;
`;

const PostStatus = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  position: relative;
  flex-flow: row;
  justify-content: space-around;
  border: 1px;
  border-top: 1px solid silver;
  border-bottom: 1px solid silver;
  :before {
    content: "";
    display: block;
    padding-top: 15%;
  }
`;

const Box = styled.div`
  padding: 0;
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
  margin: 0 auto;
  padding: 0;
  text-align: left;
  vertical-align: text-top;
`;

const Title = styled.p`
  height: 25%;
  margin: 2%;
  text-align: center;
  font-size: 0.8rem;
  ${mediaMobile`
  font-size: 0.6rem;
`}
`;

const CaptionArea = styled.div`
  display: flex;
  width: 100%;
  margin: 0 auto;
  position: relative;
  border: 1px;
  border-bottom: 1px solid silver;
  vertical-align: top;
  :before {
    content: "";
    display: block;
    padding-top: 38%;
  }
`;

const Caption = styled.div`
  width: 90%;
  height: 90%;
  margin: 2% auto;
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
                <>
                  <ImageWrap>
                    <PhotoImage src={tile.imageUrl} />
                  </ImageWrap>
                  <PostStatus>
                    <Box>
                      <Title>いいね！</Title>
                      <Container>
                        <FavoriteRounded
                          style={{
                            display: "inline-block",
                            width: "50%",
                            marginLeft: "10%",
                            fontSize: "40px",
                            textAlign: "center",
                            lineHeight: "75%",
                            color: "#4fc0ad",
                          }}
                        />
                        <CountBox>
                          <Count>200</Count>
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
                            marginLeft: "10%",
                            fontSize: "40px",
                            textAlign: "center",
                            lineHeight: "75%",
                            color: "#4fc0ad",
                          }}
                        />
                        <CountBox>
                          <Count>200</Count>
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
                            marginLeft: "10%",
                            fontSize: "40px",
                            textAlign: "center",
                            lineHeight: "75%",
                            color: "#4fc0ad",
                          }}
                        />
                        <CountBox>
                          <Count>200</Count>
                        </CountBox>
                      </Container>
                    </Box>
                  </PostStatus>
                  <CaptionArea>
                    <Caption>{tile.caption}</Caption>
                  </CaptionArea>
                </>
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
