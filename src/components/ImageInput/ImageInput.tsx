import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { auth, storage, db } from "../../firebase";
import firebase from "firebase/app";
import styles from "./ImageInput.module.css";
import {
  Button,
  makeStyles,
  Theme,
  Container,
  createStyles,
} from "@material-ui/core";

import { CloseRounded, Image } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerContainer: {
      display: "flex",
      justifyContent: "left",
      height: "35px",
      paddingTop: "7px",
      lineHeight: "35px",
      fontSize: "18px",
    },
    closeButton: {
      display: "none",
    },
    closeIcon: {
      height: "35px",
      width: "35px",
      borderRadius: "100%",
      color: "#aaa",
      transition: "all 0.3s",
      "&:hover": {
        backgroundColor: "#ccc",
        color: "#fff",
      },
    },
    title: {
      height: "35px",
      width: "100px",
      margin: "0 auto",
      fontSize: "18px",
      fontWeight: "bold",
      color: "rgba(0,0,0,0.8)",
    },
    container: {
      margin: "0px",
      padding: "0px",
    },
    imageIcon: {
      width: "200px",
      height: "200px",
      display: "block",
      margin: "0 auto",
      paddingTop: "30px",
    },
    containedPrimary: {
      marginTop: "20px",
      width: "250px",
      height: "50px",
      borderRadius: "250px",
      backgroundColor: "hsl(142,57%,45%)",
      boxShadow: "none",
      fontSize: "18px",
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: "hsl(142,67%,45%)",
        boxShadow: "1px 1px 10px hsl(142,57%,45%)",
      },
    },
    containedSecondary: {
      width: "250px",
      height: "50px",
      marginTop: "20px",
      borderRadius: "250px",
      backgroundColor: "hsl(15,25%,37%)",
      boxShadow: "none",
      fontSize: "18px",
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: "hsl(15,25%,47%)",
        boxShadow: "1px 1px 10px hsl(15,25%,47%)",
      },
    },
  })
);
const wrapper = {
  background: "#f7f3e8",
};
const header = {
  width: "100%",
  height: "50px",
  backgroundColor: "#fff",
  borderBottom: "1px solid rgba(64,28,0,0.2)",
  fontSize: "15px",
};
const main = {
  backgroundColor: "#f7f3e8",
};
const preview = {
  width: "100%",
  height: "350px",
  margin: "0px",
  backgroundColor: "#ccc",
  color: "#aaa",
};
const imagePreview = {
  width: "100%",
  height: "350px",
  margin: "0px",
};
const list = {
  listStyle: "none",
};
const inputForm = {
  marginTop: "20px",
};
const inputFile = {
  display: "none",
};
const upload = {
  display: "none",
};
export default function ImageInput() {
  const user = useSelector(selectUser);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>("");
  const [caption, setCaption] = useState<String>("");
  const classes = useStyles();
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const FileList: FileList | null = e.target.files;
    if (FileList) {
      const file: File | null = FileList.item(0);
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

  const handleCaption = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputText = e.target.value;
    if (inputText) {
      setCaption(inputText);
      console.log(caption);
    }
  };

  // onUploadが呼び出される瞬間、ブラウザの再読み込みがスタートしてしまうので、
  // e.preventDefault()で規定の動作をキャンセルしています。
  const onUpload = (e: any) => {
    e.preventDefault();
    if (image && caption) {
      const image_name = image.name;
      console.log(caption);
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
          console.log(caption);
          db.collection("posts").add({
            username: user.displayName,
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

  return (
    <div style={wrapper}>
      <header data-testid="header" style={header}>
        <Container maxWidth="md" className={classes.headerContainer}>
          <button
            id="closeButton"
            className={classes.closeButton}
            onClick={signOut}
          />
          <label htmlFor="closeButton">
            <CloseRounded className={classes.closeIcon} />
          </label>
          <p className={classes.title}>新規投稿</p>
        </Container>
      </header>
      <Container component="main" maxWidth="xs" style={main}>
        <div style={preview}>
          {imageUrl === "" ? (
            <>
              <Image className={classes.imageIcon} />
              <p className={styles.noImage}>No Image</p>
            </>
          ) : (
            <img src={imageUrl} style={imagePreview} alt="uploader" />
          )}
        </div>
        <form>
          <li style={list}>
            <div style={inputForm}>
              <input
                type="file"
                onChange={handleImage}
                id="inputFile"
                style={inputFile}
              />
              <label htmlFor="inputFile">
                <Button
                  variant="contained"
                  size="medium"
                  color="primary"
                  className={classes.containedSecondary}
                  component="span"
                >
                  写真を選択する
                </Button>
              </label>
            </div>
          </li>
          <li style={list}>
            <textarea
              className={styles.textarea}
              placeholder="コメントを追加"
              onChange={handleCaption}
            ></textarea>
          </li>
          <li style={list}>
            <button id="uploadFile" onClick={onUpload} style={upload} />
            <label htmlFor="uploadFile">
              <Button
                variant="contained"
                size="medium"
                color="primary"
                className={classes.containedPrimary}
                component="span"
              >
                投稿する
              </Button>
            </label>
          </li>
        </form>
      </Container>
    </div>
  );
}
