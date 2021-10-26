import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, update } from "../../features/userSlice";
import { db, storage } from "../../firebase";
import firebase from "firebase/app";
import Header from "../Parts/Header";
import IconButton from "../Parts/IconButton";
import InputFileButton from "../Parts/InputFileButton";
import ColorButton from "../Parts/ColorButton";
import { makeStyles, createStyles, Theme } from "@material-ui/core";
import { NavigateBefore } from "@material-ui/icons";
import styled from "styled-components";
import mediaQuery from "styled-media-query";

const mediaMobile = mediaQuery.lessThan("medium");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      left: "5px",
      width: "32px",
      height: "42px",
      borderRadius: "100%",
    },
  })
);

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Main = styled.div`
  width: 30vw;
  ${mediaMobile`
    width: 100vw;
  `}
`;

const UserNameSection = styled.div`
  display: flex;
  position: relative;
  width: 90%;
  height: 120px;
  margin: 0 auto;
  flex-flow: row;
  color: rgba(0, 0, 0, 0.87);
`;

const UserNameArea = styled.div`
  width: 100%;
`;

const UserName = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 90%;
  height: 60px;
  margin-top: 10px;
  font-size: 1.2rem;
  overflow: hidden;
  color: #555;
  margin-bottom: 0px;
  ${mediaMobile`
  font-size: 1.2rem 
`};
`;

const UserIcon = styled.img`
  width: 80px;
  height: 80px;
  margin: 20px 10px 10px 10px;
  border-radius: 100%;
`;

const Form = styled.form`
  display: flex;
  width: 85%;
  margin: 0 auto;
  height: 520px;
  flex-flow: column;
  font-size: 0.8rem;
`;

const Label = styled.label`
  margin-bottom: 20px;
`;

const Input = styled.input`
  display: inline;
  width: 90%;
  height: 20px;
  margin-top: 5px;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  resize: none;
  background-color: hsl(0, 0%, 95%);
  font-family: "Yu Gothic";
`;
const Textarea = styled.textarea`
  display: block;
  width: 90%;
  height: 100px;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 1rem;
  resize: none;
  background-color: hsl(0, 0%, 95%);
  font-family: "Yu Gothic";
`;

const EditProfile = (props: any) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const uid = user.uid;
  const [userName, setUserName] = useState(user.userName);
  const [userIcon, setUserIcon] = useState(user.userIcon);
  const [prefecture, setPrefecture] = useState(user.prefecture);
  const [job, setJob] = useState(user.job);
  const [introduction, setIntroduction] = useState(user.introduction);
  const oldUserIcon = user.userIcon;
  const noUserIcon = `${process.env.PUBLIC_URL}/noUserIcon.png`;
  const classes = useStyles();

  function changeImage(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const files: FileList | null = e.target.files;
    const file: File | null = files!.item(0);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        dispatch(update({ userIcon: reader.result as string }));
      };
      reader.onerror = (error) => {
        alert(error);
      };
    }
  }

  function changeInput(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const { value, name } = e.target;
    switch (name) {
      case "userName":
        value ? setUserName(value) : setUserName("");
        console.log(userName);
        break;
      case "prefecture":
        value ? setPrefecture(value) : setPrefecture("");
        break;
      case "job":
        value ? setJob(value) : setJob("");
        break;
      default:
        console.log("その他の値です。");
    }
  }

  function changeText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    const inputText = e.target.value;
    inputText ? setIntroduction(inputText) : setIntroduction("");
  }

  function submitChanges(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    if (userIcon !== oldUserIcon) {
      storage
        .ref(`userIcons / ${uid}`)
        .putString(userIcon, "data_url")
        .on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          () => {},
          (error: any) => {
            alert(error.message);
          },
          () => {
            storage
              .ref(`userIcons/${uid}`)
              .getDownloadURL()
              .then((url) => {
                db.collection("users").doc(uid).set(
                  {
                    userIcon: url,
                  },
                  { merge: true }
                );
                dispatch(update({ userIcon: userIcon }));
              });
          }
        );
    }
    db.collection("users")
      .doc(uid)
      .set(
        {
          userName: userName,
          prefecture: prefecture,
          job: job,
          introduction: introduction,
        },
        { merge: true }
      )
      .then(() => {
        closeEdit();
      });
  }

  function closeEdit() {
    return props.closeWindow();
  }

  return (
    <>
      <Wrapper>
        <Header child="プロフィールを編集する" style={{ zIndex: 3 }}>
          <IconButton
            dataTestId="backButton"
            onClick={() => {
              closeEdit();
            }}
          >
            <NavigateBefore className={classes.icon} />
          </IconButton>
        </Header>
        <div style={{ width: "100%", height: "52px", margin: "0px" }} />
        <Main>
          <UserNameSection>
            <UserIcon src={userIcon === "" ? noUserIcon : userIcon} />
            <UserNameArea>
              <UserName>{userName ? userName : "匿名のユーザー"}</UserName>
              <InputFileButton
                onChange={changeImage}
                child="写真を選ぶ"
                style={{
                  width: "160px",
                  left: "10px",
                  fontSize: "1rem",
                }}
              />
            </UserNameArea>
          </UserNameSection>
          <Form>
            <Label>
              ユーザーネーム
              <Input
                data-testid="userNameInput"
                placeholder="あなたの名前(必須)"
                value={userName}
                name="userName"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  changeInput(e);
                }}
              />
            </Label>
            <Label>
              都道府県
              <Input
                data-testid="userNameInput"
                placeholder="あなたの住んでいる都道府県"
                value={prefecture}
                name="prefecture"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  changeInput(e);
                }}
              ></Input>
            </Label>
            <Label>
              お仕事
              <Input
                data-testid="userNameInput"
                placeholder="あなたの現在のお仕事"
                value={job}
                name="job"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  changeInput(e);
                }}
              ></Input>
            </Label>
            <Label>
              紹介文
              <Textarea
                placeholder="あなた自身のことを紹介してみましょう。"
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  changeText(e);
                }}
                value={introduction}
              ></Textarea>
            </Label>
            <ColorButton
              dataTestId="SubmitButton"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                submitChanges(e)
              }
              child="この内容で登録する"
              color="primary"
              style={{
                width: "200px",
                margin: "0 auto",
              }}
            />
          </Form>
        </Main>
      </Wrapper>
    </>
  );
};

export default EditProfile;
