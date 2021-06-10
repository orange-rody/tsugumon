import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { auth, storage, db } from "../../firebase";
import firebase from "firebase/app";
import styled from "styled-components";
import {
  Paper,
  Button,
  createMuiTheme,
  makeStyles,
  createStyles,
  Theme,
  ThemeProvider,
  useMediaQuery,
} from "@material-ui/core";
import { ArrowDownward, CropOriginal } from "@material-ui/icons";
import useMedia from "use-media";

// TODO >> iPhoneの画面サイズに合わせてレイアウトが自動的に変わるようにする
// メディアクエリ ブレークポイント などを使ってcssで指定した方が無難？
// コンポーネントごとにスタイルの設定ファイルがバラバラになってしまうと、管理できなくなりそうで不安。

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
    paperA: {
      width: "40vw",
      margin: "20px auto",
    },
    paperB: {
      width: "100vw",
    },
    button: {
      width: "150px",
      height: "40px",
      borderRadius: "50px",
      fontSize: "18px",
      fontWeight: "bold",
    },
  })
);

const upload = {
  display: "none",
};
export default function ImageInput() {
  const user = useSelector(selectUser);
  const [image, setImage] = useState<File | null>();
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    `${process.env.PUBLIC_URL}/noPhoto.png`
  );
  const [caption, setCaption] = useState<string>("");

  const classes = useStyles();
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const FileList: FileList | null = e.target.files;
    if (FileList) {
      const file: File = FileList.item(0)!;
      setImage(file);
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          // 画像ファイルを base64 文字列に変換します
          // resultはstring,ArrayBuffer,nullの3つの値を取りうるので、as stringを使って
          // 必ず値が文字列となるようにします
          setImageUrl(reader.result as string);
        },
        false
      );
      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  const clearImage = (e: React.MouseEvent<HTMLElement>) => {
    setImageUrl(`${process.env.PUBLIC_URL}/noPhoto.png`);
  };

  const handleCaption = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    if (inputText) {
      setCaption(inputText);
      console.log(caption);
    }
  };

  const onUpload = (e: any) => {
    // onUploadが呼び出される瞬間、ブラウザの再読み込みがスタートしてしまうので、
    // e.preventDefault()で規定の動作をキャンセルします。
    e.preventDefault();
    if (image && caption) {
      const image_name = image.name;
      console.log(caption);
      // TODO>>image_nameの暗号化
      const storageRef = storage.ref().child("images/" + image_name);
      console.log(storageRef);
      const uploadImage = storageRef.put(image);
      uploadImage.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (err: any) => {
          alert(err.message);
        },
        () => {
          // firestoreのルール設定が書き込み不可になっていた場合、エラーになってしまうので注意！
          db.collection("posts").add({
            // TODO >> usernameがnull値で登録される問題の解決
            // もしかしたらテストユーザーの名前を登録していないことが原因かも?
            image: image_name,
            text: caption,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }
      );
    } else if (image && !caption) {
      const image_name = image.name;
      const storageRef = storage.ref().child("images/" + image_name);
      storageRef.put(image);
    }
    setImage(null);
    setImageUrl("");
    setCaption("");
  };

  const signOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    auth.signOut();
  };

  const isWide = useMedia({ minWidth: "481px" });
  const matches = useMediaQuery("(min-width:481px");

  const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
  `;

  const Header = styled.header`
    display: flex;
    width: ${isWide ? 40 : 100}vw;
    height: 42px;
    margin: 0 auto;
    background-color: rgb(221, 202, 175);
    background-size: 10px 10px;
    border-bottom: 1px solid hsla(26, 100%, 12%, 0.2);
    box-sizing: border-box;
  `;

  const Title = styled.h2`
    width: 150px;
    height: 42px;
    margin: 0 auto;
    font-size: 18px;
    line-height: 42px;
    text-align: center;
    color: hsl(0, 0%, 10%);
    font-weight: bold;
    letter-spacing: 40px;
  `;

  const Title2 = styled(Title)`
    letter-spacing: 10px;
  `;

  const Main = styled.main`
    display: flex;
    flex-flow: column;
    width: ${isWide ? 40 : 100}vw;
    margin: 0 auto;
    background-color: hsl(0, 0%, 100%);
  `;

  const ImageContainer = styled.div`
    width: ${isWide ? 40 : 100}vw;
    position: relative;
  `;

  const PhotoImage = styled.img`
    display: block;
    width: ${isWide ? 35 : 100}vw;
    object-fit: cover;
    margin: ${isWide ? 20 : 0}px auto 0;
    opacity: ${imageUrl === `${process.env.PUBLIC_URL}/noPhoto.png` ? 0.3 : 1};
  `;

  const Notes = styled.div`
    position: absolute;
    left: 50%;
    bottom: ${isWide ? 20 : 0}px;
    width: 200px;
    height: 60px;
    transform: translateX(-50%);
    text-align: center;
  `;

  const ButtonArea = styled.div`
    display: flex;
    width: ${isWide ? 40 : 100}vw;
    height: 60px;
    margin-top: 20px;
    justify-content: space-around;
  `;

  const InputFile = styled.input`
    display: none;
  `;

  const img: HTMLImageElement = new Image()!;
  img.src = `${process.env.PUBLIC_URL}/noPhoto.png`;

  return (
    // themeを適用させるには<ThemeProvider>を使用する
    <ThemeProvider theme={theme}>
      <Wrapper>
        <Paper
          elevation={2}
          className={matches ? classes.paperA : classes.paperB}
        >
          <Header data-testid="header">
            <Title>写真</Title>
          </Header>
          <Main>
            <ImageContainer>
              <PhotoImage src={imageUrl} alt="uploader" />
              {imageUrl === `${process.env.PUBLIC_URL}/noPhoto.png` ? (
                <Notes>
                  写真を選んでください。
                  <ArrowDownward
                    style={{
                      display: "block",
                      margin: "10px auto",
                      height: "18px",
                    }}
                  />
                </Notes>
              ) : (
                ""
              )}
            </ImageContainer>
            <form>
              <ButtonArea>
                <InputFile type="file" onChange={handleImage} id="inputFile" />
                <label htmlFor="inputFile">
                  <Button
                    variant="contained"
                    component="span"
                    size="large"
                    startIcon={<CropOriginal />}
                    color="primary"
                    className={classes.button}
                  >
                    選ぶ
                  </Button>
                </label>
                <button
                  id="clearFile"
                  onClick={clearImage}
                  style={{ display: "none" }}
                />
                <label htmlFor="clearFile">
                  <Button
                    variant="outlined"
                    component="span"
                    size="large"
                    className={classes.button}
                    color="default"
                  >
                    消す
                  </Button>
                </label>
              </ButtonArea>
              <Header data-testid="header">
                <Title2>コメント</Title2>
              </Header>
              <li>
                <textarea
                  id="textareaForm"
                  placeholder="コメントを追加"
                  onChange={handleCaption}
                  value={caption}
                ></textarea>
              </li>
              <li>
                <button id="uploadFile" onClick={onUpload} style={upload} />
                <label htmlFor="uploadFile">
                  {/* TODO >> Imageステートが空のときは投稿ボタンが押せないようにする */}
                  <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    component="span"
                  >
                    投稿する
                  </Button>
                </label>
              </li>
            </form>
          </Main>
        </Paper>
      </Wrapper>
    </ThemeProvider>
  );
}
