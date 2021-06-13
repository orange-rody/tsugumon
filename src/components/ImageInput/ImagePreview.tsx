import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../features/userSlice";
import {
  selectImageUrl,
  selectCaption,
  HandleImageUrl,
  ClearImageUrl,
  HandleCaption,
  ClearCaption,
  TogglePreview,
} from "../../features/postSlice";
import { auth, storage, db } from "../../firebase";
import firebase from "firebase/app";
import styled from "styled-components";
import mediaQuery from "styled-media-query";
import {
  Paper,
  Button,
  createMuiTheme,
  makeStyles,
  createStyles,
  Avatar,
  Theme,
  ThemeProvider,
  useMediaQuery,
} from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#4fc0ad",
      main: "#008f7e",
      dark: "#006152",
      contrastText: "#fff",
    },
    secondary: {
      light: "#50a0d0",
      main: "#00729f",
      dark: "#004770",
      contrastText: "#fff",
    },
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: "0",
      left: "0",
    },
    button: {
      width: "120px",
      height: "40px",
      borderRadius: "50px",
      fontSize: "18px",
      fontWeight: "bold",
    },
  })
);

const Header = styled.div`
  display: flex;
  width: 100%;
  height: 52px;
  margin: 0 auto;
  background-color: rgb(221, 202, 175);
  border-bottom: 1px solid hsla(26, 100%, 12%, 0.2);
  box-sizing: border-box;
`;

const Title = styled.h2`
  width: 70%;
  height: 52px;
  margin: 0 auto;
  font-size: 18px;
  line-height: 52px;
  text-align: center;
  color: hsl(0, 0%, 10%);
  font-weight: bold;
`;

const Main = styled.main`
  display: flex;
  flex-flow: column;
  width: 100%;
  margin: 0 auto;
  background-color: hsl(0, 0%, 100%);
`;

const UserInfo = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  margin: 0 auto;
  background-color: rgb(255, 255, 255);
  border-bottom: 1px solid hsla(26, 100%, 12%, 0.2);
  box-sizing: border-box;
`;

const UserIcon = styled.div`
  width: 40px;
  height: 40px;
  margin: 10px;
  border-radius: 100%;
  background-color: hsl(0, 0%, 90%);
`;

const UserImage = styled.img`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border-radius: 100%;
`;

const UserName = styled.p`
  width: 150px;
  height: 60px;
  margin: 0;
  line-height: 60px;
`;
      
const ImageWrap = styled.div`
  width: 100%;
  margin: 0 auto;
  position: relative;
  :before {
    content: "";
    display: block;
    padding-top: 75%;
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
  display: flex;
  width: 100%;
  height: 60px;
  margin-top: 20px;
  justify-content: space-around;
`;

const CommentArea = styled.p`
  width: 80%;
  height: 80px;
  margin: 20px auto 0;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
`;

export default function ImagePreview() {
  const user = useSelector(selectUser);
  const imageUrl = useSelector(selectImageUrl);
  const caption = useSelector(selectCaption);
  const dispatch = useDispatch();
  const classes = useStyles();
  const noImage = `${process.env.PUBLIC_URL}/noPhoto.png`;

  const togglePreview = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(TogglePreview());
  };

  const upload = (e: React.MouseEvent<HTMLElement>) => {
    // NOTE>> uploadが呼び出される瞬間、ブラウザの再読み込みがスタートしてしまうので、
    //        e.preventDefault()で規定の動作をキャンセルします。
    e.preventDefault();
    if (imageUrl !== noImage) {
      // TODO>>image_nameの暗号化
      const uploadImage = storage
        .ref()
        .child("images/")
        .putString(imageUrl, "data_url");

      uploadImage.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (err: any) => {
          alert(err.message);
        },
        () => {
          //NOTE>> firestoreのルール設定が書き込み不可になっていた場合、エラーになってしまうので注意！
          db.collection("posts")
            .add({
              userName: user.userName,
              imageUrl: "",
              caption: caption,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then(() => {
              dispatch(TogglePreview);
              dispatch(ClearImageUrl);
              dispatch(ClearCaption);
            });
        }
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* ImagePreviewを表示するときのアニメーションを実装する */}
      <Paper elevation={2} className={classes.paper}>
        <Main>
          <Header>
            <Title>この内容で登録しますか？</Title>
          </Header>
          <UserInfo>
            {/* todo//ユーザーアイコンの画像を取得して、Avatarに読み込む */}
            <UserIcon>
              <UserImage />
            </UserIcon>
            {/* todo//ユーザーネームをfirestoreから取得して表示する */}
            <UserName>ユーザーネーム</UserName>
          </UserInfo>
          <ImageWrap>
            {/* リンク切れなどの要因でimageUrlがnoImageとなった場合、Feed画面に戻ることを促すモーダルを表示するようにする。 */}
            <PhotoImage src={imageUrl} alt="uploader" />
          </ImageWrap>
          <CommentArea>{caption}</CommentArea>
          <ButtonArea>
            <Button
              variant="contained"
              component="span"
              size="large"
              color="secondary"
              className={classes.button}
              onClick={upload}
            >
              登録する
            </Button>
            <Button
              variant="outlined"
              size="large"
              color="default"
              className={classes.button}
              onClick={togglePreview}
            >
              戻る
            </Button>
          </ButtonArea>
        </Main>
      </Paper>
    </ThemeProvider>
  );
}
