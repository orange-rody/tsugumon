import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../features/userSlice";
import {
  selectImageUrl,
  selectCaption,
  selectPreview,
  HandleImageUrl,
  ClearImageUrl,
  HandleCaption,
  ClearCaption,
  TogglePreview,
} from "../../features/postSlice";
import ImagePreview from "./ImagePreview";
import { auth, storage, db } from "../../firebase";
import firebase from "firebase/app";
import styled from "styled-components";
// styled-componentをfunctionコンポーネントの中で使用すると、
// textareaの入力時に不具合が起きてしまう。そのため、コンポーネントの
// 外部でメディアクエリの判定をしないといけないが、styled-media-queryを
// 使うことで、その問題を解決することができる。
import mediaQuery from "styled-media-query";
import {
  Paper,
  Button,
  createMuiTheme,
  makeStyles,
  createStyles,
  Theme,
  ThemeProvider,
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
    paper: {
      width: "100%",
      height: "100%",
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

const Header = styled.div`
  display: flex;
  width: 100%;
  height: 52px;
  margin: 0 auto;
  background-color: rgb(255, 255, 255);
  border-bottom: 1px solid hsla(26, 100%, 12%, 0.2);
  box-sizing: border-box;
`;

const Title = styled.h2`
  width: 70%;
  height: 52px;
  margin: 0 auto;
  font-size: 18px;
  line-height: 60px;
  text-align: center;
  color: hsl(0, 0%, 10%);
  font-weight: bold;
  letter-spacing: 5px;
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
  height: 40px;
  margin-top: 20px;
  justify-content: space-around;
`;

const Textarea = styled.textarea`
  display: block;
  width: 80%;
  height: 80px;
  margin: 20px auto 0;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  resize: none;
  background-color: hsl(0, 0%, 95%);
`;

const InputFile = styled.input`
  display: none;
`;

export default function ImageInput() {
  const user = useSelector(selectUser);
  const imageUrl = useSelector(selectImageUrl);
  const caption = useSelector(selectCaption);
  const preview = useSelector(selectPreview);
  const dispatch = useDispatch();
  const noImage = `${process.env.PUBLIC_URL}/noPhoto.png`;
  const [imageFile, setImageFile] = useState<File | null>();

  const classes = useStyles();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const FileList: FileList = e.target.files!;
    const file: File = FileList.item(0)!;
    // Fileオブジェクトはシリアライズされないため、reduxに保存が不可能。
    // 従って、Fileオブジェクトはlocalステートに保存することとする。
    setImageFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener(
      "load",
      () => {
        // 画像ファイルを base64 文字列に変換します
        // resultはstring,ArrayBuffer,nullの3つの値を取りうるので、as stringを使って
        // 必ず値が文字列となるようにします
        // setImageUrl(reader.result as string);
        dispatch(HandleImageUrl(reader.result as string));
      },
      false
    );
  };

  const clearImageUrl = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(ClearImageUrl());
  };

  const handleCaption = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    // 入力文字が1文字もない場合は、空白となるようClearCaptionのアクションを実行している。
    // もしClearCaptionを実行しなかったら、テキストエリアの最後の1文字を消去することができなくなる。
    dispatch(inputText ? HandleCaption(inputText) : ClearCaption());
  };

  const onUpload = (e: React.MouseEvent<HTMLElement>) => {
    // onUploadが呼び出される瞬間、ブラウザの再読み込みがスタートしてしまうので、
    // e.preventDefault()で規定の動作をキャンセルします。
    e.preventDefault();
    if (imageFile) {
      // TODO>>image_nameの暗号化
      const uploadImage = storage.ref().child("images/").put(imageFile);
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
            userName: user.userName,
            imageUrl: "",
            caption: caption,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }
      );
    }
    dispatch(ClearImageUrl);
    dispatch(ClearCaption);
    dispatch(TogglePreview);
  };

  const togglePreview = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(TogglePreview());
  };

  const upload = {
    display: "none",
  };

  const img: HTMLImageElement = new Image()!;
  img.src = noImage;

  return (
    // themeを適用させるには<ThemeProvider>を使用する
    <ThemeProvider theme={theme}>
      <Wrapper>
        <Paper elevation={2} className={classes.paper}>
          <Main>
            <Header data-testid="header">
              <Title>写真を登録する</Title>
            </Header>
            <ImageWrap>
              {imageUrl === noImage ? (
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
                <Button
                  id="clearFile"
                  variant="outlined"
                  color="default"
                  size="large"
                  className={classes.button}
                  onClick={clearImageUrl}
                >
                  消す
                </Button>
              </ButtonArea>
              <Textarea
                id="textareaForm"
                placeholder="コメントを入力する"
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
                  onClick={togglePreview}
                >
                  次へ進む
                </Button>
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
        {!preview ? "" : 
          <ImagePreview/>}
      </Wrapper>
    </ThemeProvider>
  );
}
