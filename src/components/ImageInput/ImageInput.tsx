import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../features/userSlice";
import {
  selectImage,
  selectCaption,
  selectPreview,
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
  Theme,
  ThemeProvider,
  useMediaQuery,
} from "@material-ui/core";
import { ArrowDownward, CropOriginal } from "@material-ui/icons";

//mediumより小さかったらmediaMobileのプロパティが設定されるようにする
const mediaMobile = mediaQuery.lessThan("medium");

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
      width: "120px",
      height: "40px",
      borderRadius: "50px",
      fontSize: "18px",
      fontWeight: "bold",
    },
  })
);

const Label = styled.div`
  display: flex;
  width: 100%;
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
  width: 100%;
  margin: 0 auto;
  background-color: hsl(0, 0%, 100%);
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

const NoPhotoImage = styled(PhotoImage)`
  opacity: 0.3;
`;

const Notes = styled.div`
  position: absolute;
  left: 50%;
  bottom: 20px;
  ${mediaMobile`
  bottom: 0px;`}
  width: 200px;
  height: 60px;
  transform: translateX(-50%);
  text-align: center;
`;

const ButtonArea = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  margin-top: 20px;
  justify-content: space-around;
`;

const Textarea = styled.textarea`
  display: block;
  width: 90%;
  height: 100px;
  margin: 20px auto 0;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  resize: none;
  background-color: rgba(221, 202, 175, 0.3);
`;

const InputFile = styled.input`
  display: none;
`;
export default function ImageInput() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [image, setImage] = useState<File | null>();
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    `${process.env.PUBLIC_URL}/noPhoto.png`
  );
  const [caption, setCaption] = useState<string>("");

  const classes = useStyles();
  const matches = useMediaQuery("(min-width:481px");

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
    e.preventDefault();
    setImageUrl(`${process.env.PUBLIC_URL}/noPhoto.png`);
  };

  const handleCaption = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    //テキストエリアの文字を全消去できるようにsetCaption("")の処理をかけている
    inputText ? setCaption(inputText) : setCaption("");
  };

  const clearCaption = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setCaption("");
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

  const upload = {
    display: "none",
  };

  const img: HTMLImageElement = new Image()!;
  img.src = `${process.env.PUBLIC_URL}/noPhoto.png`;

  return (
    // themeを適用させるには<ThemeProvider>を使用する
    <ThemeProvider theme={theme}>
      <Paper
        elevation={2}
        className={matches ? classes.paperA : classes.paperB}
      >
        <Main>
          <Label data-testid="header">
            <Title>写真</Title>
          </Label>
          <ImageWrap>
            {imageUrl === `${process.env.PUBLIC_URL}/noPhoto.png` ? (
              <>
                <NoPhotoImage src={imageUrl} alt="uploader" />
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
              </>
            ) : (
              <PhotoImage src={imageUrl} alt="uploader" />
            )}
          </ImageWrap>
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
            <Label data-testid="header">
              <Title2>コメント</Title2>
            </Label>
            <Textarea
              id="textareaForm"
              placeholder="タップして入力する"
              onChange={handleCaption}
              value={caption}
            ></Textarea>
            <ButtonArea>
              <Button
                variant="contained"
                component="span"
                size="large"
                color="secondary"
                className={classes.button}
                disabled={
                  imageUrl === `${process.env.PUBLIC_URL}/noPhoto.png`
                    ? true
                    : false
                }
              >
                次へ進む
              </Button>
              <button
                id="clearCaption"
                onClick={clearCaption}
                style={{ display: "none" }}
              />
              <label htmlFor="clearCaption">
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
          </form>
        </Main>
      </Paper>
    </ThemeProvider>
  );
}
