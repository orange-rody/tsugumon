import React, { useState } from "react";
import SecondaryButton from "../Parts/SecondaryButton";
import styled from "styled-components";
import mediaQuery from "styled-media-query";
import {
  Paper,
  makeStyles,
  createStyles,
  Theme,
  Slide,
} from "@material-ui/core";

const mediaMobile = mediaQuery.lessThan("medium");
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "100%",
      height: "100%",
    },
    paperForPreview: {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: "0",
      left: "0",
    },
  })
);

const Wrapper = styled.div`
  position: relative;
  width: 30vw;
  ${mediaMobile`
  width: 100vw;`}
  height: calc(100vh - 40px);
  ${mediaMobile`
  height: 100vh`};
  margin: 20px auto;
  ${mediaMobile`
  margin: 0;`}
  padding: 0;
`;

const Main = styled.main`
  display: flex;
  flex-flow: column;
  width: 100%;
  margin: 0 auto;
  background-color: hsl(0, 0%, 100%);
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  height: 52px;
  margin: 0 auto;
  background-color: hsl(0, 0%, 100%);
  border-bottom: 1px solid hsla(26, 100%, 12%, 0.2);
  box-sizing: border-box;
`;

const ButtonArea = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  margin-top: 20px;
  justify-content: space-around;
`;

const Textarea = styled.textarea`
  display: block;
  width: 80%;
  height: 100px;
  margin: 20px auto 0;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  resize: none;
  background-color: hsl(0, 0%, 95%);
  font-family: "Yu Gothic";
`;

const CommentArea = styled.p`
  width: 80%;
  height: 100px;
  margin: 20px auto 0;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
`;

export default function CreatePost() {
  const [caption, setCaption] = useState<string>("");
  const [preview, setPreview] = useState<boolean>(false);
  const classes = useStyles();
  const handleCaption = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    inputText ? setCaption(inputText) : setCaption("");
  };

  const togglePreview = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setPreview(!preview);
  };
  return (
    <Wrapper data-testid="wrapper">
      <Paper elevation={2} data-testid="paper">
        <Main>
          <Header>下書き</Header>
          <Textarea
            id="textareaForm"
            placeholder="コメントを入力する"
            onChange={handleCaption}
            value={caption}
            data-testid="textarea"
          />
          <ButtonArea>
            <SecondaryButton
              disabled={caption === "" ? true : false}
              onClick={togglePreview}
              dataTestId="togglePreview"
              child="次へ進む"
            />
          </ButtonArea>
        </Main>
      </Paper>
      <Slide direction="left" in={preview} mountOnEnter unmountOnExit>
        <Paper
          elevation={2}
          className={classes.paperForPreview}
          data-testid="paperForPreview"
        >
          <Main>
            <Header>プレビュー画面</Header>
            <CommentArea data-testid="commentArea">{caption}</CommentArea>
            <ButtonArea>
              <SecondaryButton
                // NOTE >> onClickイベントには本来、Firebase Firestoreにステートの内容を登録する関数を
                //         割り当てるのですが、ここでは便宜的にconsole.log(caption)を実行するよう、指定
                //         しています。
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  console.log(caption);
                }}
                dataTestId="buttonForUpload"
                disabled={caption === "" ? true : false}
                child="登録する"
              />
            </ButtonArea>
          </Main>
        </Paper>
      </Slide>
    </Wrapper>
  );
}
