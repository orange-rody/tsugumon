import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { storage, db } from "../../firebase";
import firebase from "firebase/app";
import Header from "../Parts/Header";
import InputFileButton from "../Parts/InputFileButton";
import DefaultButton from "../Parts/DefaultButton";
import ColorButton from "../Parts/ColorButton";
import IconButton from "../Parts/IconButton";
import ProgressBar from "../Parts/ProgressBar";
import styled from "styled-components";
// NOTE >> styled-componentをfunctionコンポーネントの中で使用すると、
//         textareaの入力時に不具合が起きてしまうので注意が必要。
import { makeStyles, createStyles, Theme, Slide } from "@material-ui/core";
import { ArrowDownward, Close, NavigateBefore } from "@material-ui/icons";
import mediaQuery from "styled-media-query";

// NOTE >> mediumよりサイズが小さかったらmediaMobileのプロパティが設定されるようにする。
const mediaMobile = mediaQuery.lessThan("medium");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperForDraft: {
      width: "100%",
      height: "100%",
      position: "absolute",
      top: "0",
      left: "0",
      zIndex: 998,
    },
    paperForPreview: {
      with: "100%",
      height: "100%",
      position: "absolute",
      top: "0",
      width: "0",
      zIndex: 999,
    },
    icon: {
      left: "5px",
      width: "32px",
      height: "42px",
      borderRadius: "100%",
    },
  })
);

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
  height: 52px;
  margin: 10px auto 0px;
  background-color: hsl(0, 0%, 100%);
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

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  object-fit: cover;
`;

const NoImage = styled(Image)`
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

type Props = {
  open: boolean;
  closeAdd: any;
};

export default function UploadForm(props: Props) {
  const user = useSelector(selectUser);
  const noImage = `${process.env.PUBLIC_URL}/noPhoto.png`;
  const [data, setData] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [preview, setPreview] = useState<boolean>(false);
  const [filename, setFilename] = useState<string>("");
  const types: string[] = ["image/png", "image/jpeg"];

  const classes = useStyles();

  // FIX >> 同一の画像で「選ぶ」→「消す」を繰り返すと、ユーザーの操作に
  //        反応しなくなってしまう問題を解決しなければならない
  // SOLVED >>  stateの内容は初期化されても、e.target.valueの値は残存してしまう。
  //            そのため、同じファイルを連続で複数回選択した場合、valueの値は更新せず、
  //            したがって、onChangeイベントが発火しないことが原因であると判明した。
  //            e.preventDefault()の実行とstateの初期化を行う関数clearを宣言し、
  //            onClickで実行するように設定したら問題は解決した。

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected: File | null = e.target.files![0];
    // NOTE >> Fileオブジェクトはシリアライズされないため、reduxに保存が不可能。
    //         従って、Fileオブジェクトはlocalステートに保存する必要がある。
    if (selected && types.includes(selected.type)) {
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.readAsDataURL(selected);
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = () => {
          reject(reader.error);
        };
      })
        .then((response) => {
          setData(response as string);
        })
        .catch((error) => alert(error));
    } else {
      setData("");
      alert("拡張子が「png」もしくは「jpg」の画像ファイルを選択したください。");
    }
  };

  const clear = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setData("");
    setCaption("");
  };

  const handleCaption = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    // NOTE >> 入力文字が1文字もない場合は、テキストエリアが空白となるよう、
    //         setCaption("")で初期化を行なっている。
    // NOTE >> もしsetCaption("")を実行しなかったら、ユーザーがいくら操作しても、
    //         テキストエリアの最後の1文字を消去することができなくなる。
    inputText ? setCaption(inputText) : setCaption("");
  };

  const togglePreview = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setPreview(!preview);
  };

  const getFilename = (e: React.MouseEvent<HTMLElement>, data: string) => {
    // NOTE >> uploadが呼び出される瞬間、ブラウザの再読み込みがスタートしてしまうので、
    //         e.preventDefault()で規定の動作をキャンセルする。
    e.preventDefault();
    if (data !== "") {
      // NOTE >> ユニークなファイル名を作成する。
      const currentTime = new Date().toString();
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomCharactor = Array.from(
        // NOTE >> Uint32Array()は、32 ビット符号なし整数値が並んだ配列を格納する箱を表す。
        // NOTE  >> crypt.getRandomValues(new Uint32Array(N))は、32ビット符号なしの
        //          整数値の中から、N個分、ランダムな整数を作成することを表す。
        crypto.getRandomValues(new Uint32Array(N))
        // NOTE >> .map((n) => S[n % S.length])で、上記で作った16個のランダム整数を
        //         S.lengthで割り、その余りの数をインデックスとする要素を抜き出している。
        //         結果、crypto.getRandomValuesを使ったランダムな16桁の文字列が完成する。
      )
        .map((n) => S[n % S.length])
        .join("");
      setFilename(currentTime + randomCharactor);
    }
  };
  // // NOTE >> Storageに登録
  // storage
  // .ref(`posts / ${fileName}`)
  // .putString(data, "data_url")
  // .on(
  //   firebase.storage.TaskEvent.STATE_CHANGED,
  //   // TODO >> アップロード中にインジケータを表示するようにする。
  //   // TODO >> アップロード完了後に「投稿が完了しました」のメッセージを表示する。
  //   () => {},
  //   (err: any) => {
  //     alert(err.message);
  //   },
  //   () => {
  //     // NOTE >> getDownloadURL()でstorageから保存した画像のURLを取得する。
  //     storage
  //       .ref(`posts / ${fileName}`)
  //       .getDownloadURL()
  //       .then((url) => {
  //         db.collection("posts")
  //           .add({
  //             uid: user.uid,
  //             userName: user.userName,
  //             imageUrl: url,
  //             caption: caption,
  //             timestamp: new Date().getTime(),
  //           })
  //           .then(() => {
  //             setPreview(false);
  //             setData("");
  //             setUrl("");
  //             setCaption("");
  //           });
  //       });
  //   }
  // );

  return (
    // NOTE >> Matrial-UIのthemeを適用させるには<ThemeProvider>を
    //         使用する必要がある
    <div data-testid="createPost">
      <Slide in={props.open} direction="up" mountOnEnter unmountOnExit>
        <Main className={classes.paperForDraft} data-testid="main">
          <Header child="写真を登録する" style={{ zIndex: 999 }}>
            <IconButton
              dataTestId="closeButton"
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                props.closeAdd();
              }}
            >
              <Close className={classes.icon} />
            </IconButton>
          </Header>
          <div style={{ height: "52px" }} />
          <ImageWrap data-testid="imageWrap">
            {data === "" ? (
              <>
                <NoImage
                  src={noImage}
                  data-testid="noImage"
                  alt="写真が選択されていません。"
                />
                <Notes data-testid="notes">
                  写真を選んでください。
                  <ArrowDownward
                    style={{
                      display: "block",
                      margin: "10px auto",
                      height: "18px",
                    }}
                    data-testid="arrowDownward"
                  />
                </Notes>
              </>
            ) : (
              <Image
                src={data}
                alt="選択した写真のプレビュー"
                data-testid="image"
              />
            )}
          </ImageWrap>
          <ButtonArea data-testid="buttonArea">
            <InputFileButton onChange={handleImage} child="選ぶ" />
            <DefaultButton
              child="消す"
              onClick={clear}
              wide={false}
              dataTestId="buttonForClear"
            />
          </ButtonArea>
          {/* TODO >> Textareaの文字数制限を設定する */}
          {/* TODO >> Textareaの自動スクロール機能をつくる */}
          {/* TODO >> Textareaの制限を超えた文字を赤く表示する */}
          {/* TODO >> Enterキーを押したら、改行できるようにする */}
          <Textarea
            id="textareaForm"
            placeholder="コメントを入力する"
            onChange={handleCaption}
            value={caption}
            data-testid="textarea"
          ></Textarea>
          <ButtonArea>
            <ColorButton
              disabled={data === "" && true}
              onClick={togglePreview}
              dataTestId="previewOn"
              child="次へ進む"
              color="secondary"
            />
          </ButtonArea>
        </Main>
      </Slide>
      <Slide direction="left" in={preview} mountOnEnter unmountOnExit>
        <Main className={classes.paperForPreview} data-testid="paperForPreview">
          <Header child="この内容で登録しますか？" style={{ zIndex: 999 }}>
            <IconButton
              onClick={togglePreview}
              dataTestId="navigateBeforeButton"
            >
              <NavigateBefore
                className={classes.icon}
                data-testid="navigateBeforeIcon"
              />
            </IconButton>
          </Header>
          <div style={{ height: "52px" }} />
          <ImageWrap>
            {data !== "" && (
              <Image src={data} alt="uploader" data-testid="previewImageUrl" />
            )}
          </ImageWrap>
          <UserInfo>
            <UserIcon>
              <UserImage src={user.userIcon} />
            </UserIcon>
            <UserName data-testid="previewUserName">{user.userName}</UserName>
          </UserInfo>
          <ProgressBar filename={filename} setFilename={setFilename} data={data} setData={setData} caption={caption}setCaption = {setCaption} setPreview={setPreview}/>
          {/* TODO >> CommentAreaの表示文字をスクロールする機能をつくる */}
          <CommentArea data-testid="commentArea">{caption}</CommentArea>
          <ButtonArea>
            <ColorButton
              onClick={(e:React.MouseEvent<HTMLElement>) => {
                getFilename(e, data);
              }}
              dataTestId="buttonForUpload"
              disabled={data === "" && true}
              child="登録する"
              color="secondary"
            />
            <DefaultButton
              onClick={togglePreview}
              child="戻る"
              wide={false}
              dataTestId="previewOff"
            />
          </ButtonArea>
        </Main>
      </Slide>
    </div>
  );
}
