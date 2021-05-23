import React, { useState } from "react";
import { storage } from "../../firebase";
import { auth } from "../../firebase";
import styles from "./ImageInput.module.css";
import {
  IconButton,
  Button,
  Accordion,
  AccordionDetails,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Grid,
  withStyles,
  makeStyles,
  Theme,
  Container,
  createStyles,
} from "@material-ui/core";

import CloseRoundedIcon from "@material-ui/icons/Close";
import ImageIcon from "@material-ui/icons/Image";

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
  const [image, setImage] = useState<File | null>();
  const [imageUrl, setImageUrl] = useState<string | undefined>("");
  const classes = useStyles();
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const FileList: FileList | null = e.target.files;
    if (FileList) {
      const file: File | null = FileList.item(0);
      setImage(file);
      console.log(file);
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          // 画像ファイルを base64 文字列に変換します
          setImageUrl(reader.result as string);
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  // onUploadが呼び出される瞬間、なぜかサーバへの送信がスタートしてしまうので、
  // e.preventDefault()で規定の動作をキャンセルしています。
  const onUpload = (e: any) => {
    e.preventDefault();
    if (image) {
      console.log(image.name);
      const image_name = image.name;
      const storageRef = storage.ref().child("images/" + image_name);
      console.log(storageRef);
      storageRef.put(image).then(() => {
        console.log(`${image_name}のアップロードが完了しました。`);
      });
    }
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
            <CloseRoundedIcon className={classes.closeIcon} />
          </label>
          <p className={classes.title}>新規投稿</p>
        </Container>
      </header>
      <Container component="main" maxWidth="xs" style={main}>
        <div style={preview}>
          {imageUrl === "" ? (
            <>
              <ImageIcon className={classes.imageIcon} />
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
