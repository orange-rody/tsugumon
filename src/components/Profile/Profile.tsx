import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, update } from "../../features/userSlice";
import { storage, db } from "../../firebase";
import firebase from "firebase/app";
import Header from "../Parts/Header";
import IconButton from "../Parts/IconButton";
import InputFileButton from "../Parts/InputFileButton";
import ColorButton from "../Parts/ColorButton";
import styled from "styled-components";
import { makeStyles, createStyles, Theme } from "@material-ui/core";
import { Settings, NavigateBefore } from "@material-ui/icons";
import mediaQuery from "styled-media-query";

const mediaMobile = mediaQuery.lessThan("medium");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    settingIcon: {
      left: "5px",
      width: "32px",
      height: "42px",
      borderRadius: "100%",
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
  width: 30vw;
  ${mediaMobile`
    width: 100vw
  `};
  height: calc(100% - 103px);
`;

const UserNameSection = styled.div`
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  position: relative;
  width: 90%;
  height: 130px;
  margin: 0 auto;
  flex-flow: row;
  // background-color: blue;
`;
const IntroductionSection = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  border-top: 1px solid silver;
  border-bottom: 1px solid silver;
  margin-top: 15px;
`;

const Introduction = styled(UserNameSection)`
  position: relative;
  width: 25rem;
  ${mediaMobile`
    width: 85%;
  `}
  padding: 5px;
  height: 120px;
  margin: 10px auto;
  overflow: auto;
  }
`;

const UserIcon = styled.img`
  width: 80px;
  height: 80px;
  margin: 20px 10px 10px 10px;
  border-radius: 100%;
`;

const UserNameArea = styled.div`
  font-size: 16px;
  width: calc(100% - 10px);
  // background-color: orange;
`;

const UserName = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 95%;
  height: 60px;
  margin-top: 10px;
  font-size: 1.2rem;
  overflow: hidden;
  color: #555;
  // background-color: pink;
  margin-bottom: 0px;
  ${mediaMobile`
    font-size: 1.2rem
  `};
`;

const InputFormSection = styled.form`
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

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const uid = user.uid;
  const userName = user.userName;
  const userIcon = user.userIcon;
  const prefecture = user.prefecture;
  const job = user.job;
  const introduction = user.introduction;
  const noUserIcon = `${process.env.PUBLIC_URL}/noUserIcon.png`;
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [editedUserIcon, setEditedUserIcon] = useState<string>(userIcon);
  const [editedUserName, setEditedUserName] = useState<string>(userName);
  const [editedPrefecture, setEditedPrefecture] = useState<string>(prefecture);
  const [editedJob, setEditedJob] = useState<string>(job);
  const [editedIntroduction, setEditedIntroduction] =
    useState<string>(introduction);
  const [post, setPost] = useState([
    {
      id: "",
      caption: "",
      imageUrl: "",
      timestamp: null,
      userName: "",
    },
  ]);

  useEffect(() => {
    db.collection("posts")
      .where("uid", "==", uid)
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPost(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            caption: doc.data().caption,
            imageUrl: doc.data().imageUrl,
            timestamp: doc.data().timestamp,
            userName: doc.data().userName,
            uid: doc.data().uid,
          }))
        );
      });
  }, [uid]);

  const classes = useStyles();

  function FileRead(file: File) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
    });
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const fileList: FileList | null = e.target.files;
    const file: File | null = fileList!.item(0);
    if (file) {
      FileRead(file)
        .then((response) => {
          setEditedUserIcon(response as string);
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const inputText = e.target.value;
    const name = e.target.name;
    switch (name) {
      case "userName":
        inputText ? setEditedUserName(inputText) : setEditedUserName("");
        break;
      case "prefecture":
        inputText ? setEditedPrefecture(inputText) : setEditedPrefecture("");
        break;
      case "job":
        inputText ? setEditedJob(inputText) : setEditedJob("");
        break;
    }
  };

  const handleTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const inputText = e.target.value;
    inputText ? setEditedIntroduction(inputText) : setEditedIntroduction("");
  };

  const submitChanges = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    db.collection("users").doc(uid).set(
      {
        userName: editedUserName,
        prefecture: editedPrefecture,
        job: editedJob,
        introduction: editedIntroduction,
      },
      { merge: true }
    );
    if (editedUserIcon !== userIcon) {
      storage
        .ref(`userIcons / ${uid}`)
        .putString(editedUserIcon, "data_url")
        .on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          () => {},
          (err: any) => {
            alert(err.message);
          },
          () => {
            storage
              .ref(`userIcons / ${uid}`)
              .getDownloadURL()
              .then((url) => {
                db.collection("users").doc(uid).set(
                  {
                    userIcon: url,
                  },
                  { merge: true }
                );
              })
              .then(() => {
                db.collection("users")
                  .doc(uid)
                  .get()
                  .then((user) => {
                    const userIcon = user.data()!.userIcon;
                    dispatch(
                      update({
                        uid: uid,
                        userName: editedUserName,
                        userIcon: userIcon,
                        prefecture: editedPrefecture,
                        job: editedJob,
                        introduction: editedIntroduction,
                      })
                    );
                    setEditProfile(false);
                  });
              });
          }
        );
    } else {
      db.collection("users")
        .doc(uid)
        .get()
        .then((user) => {
          const userIcon = user.data()!.userIcon;
          if (userIcon) {
            dispatch(
              update({
                uid: uid,
                userName: editedUserName,
                userIcon: userIcon,
                prefecture: editedPrefecture,
                job: editedJob,
                introduction: editedIntroduction,
              })
            );
          } else {
            db.collection("users").doc(uid).set(
              {
                userIcon: "",
              },
              { merge: true }
            );
            dispatch(
              update({
                uid: uid,
                userName: editedUserName,
                userIcon: userIcon,
                prefecture: editedPrefecture,
                job: editedJob,
                introduction: editedIntroduction,
              })
            );
          }
        });
      setEditProfile(false);
    }
  };

  return (
    <>
      {!editProfile ? (
        <div>
          <Header
            child={userName ? userName : "匿名のユーザー"}
            style={{ zIndex: 3 }}
          >
            <IconButton
              onClick={(e: React.MouseEvent<HTMLElement>) =>
                console.log(user.userName)
              }
              dataTestId="settings"
            >
              <Settings className={classes.settingIcon} />
            </IconButton>
          </Header>
          <div style={{ width: "100%", height: "52px", margin: "0px" }} />
          <Main>
            <UserNameSection>
              <UserIcon
                src={user.userIcon === "" ? noUserIcon : user.userIcon}
              />
              <UserNameArea>
                <UserName>{userName ? userName : "匿名のユーザー"}</UserName>
                <ColorButton
                  dataTestId="profileEditButton"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    setEditProfile(true)
                  }
                  child="編集する"
                  color="primary"
                  style={{
                    left: "10px",
                    width: "150px",
                  }}
                ></ColorButton>
              </UserNameArea>
            </UserNameSection>

            <IntroductionSection>
              <Introduction>{introduction}</Introduction>
            </IntroductionSection>
            {post.map((doc, index) => (
              <div key={index}>{doc.userName}</div>
            ))}
          </Main>
        </div>
      ) : (
        <div>
          <Header child="プロフィールを編集する" style={{ zIndex: 3 }}>
            <IconButton
              dataTestId="navigateBeforeButton"
              onClick={(e: React.MouseEvent) => {
                setEditProfile(false);
              }}
            >
              <NavigateBefore className={classes.icon} />
            </IconButton>
          </Header>
          <div style={{ width: "100%", height: "52px", margin: "0px" }} />
          <Main>
            <UserNameSection>
              <UserIcon
                src={editedUserIcon === "" ? noUserIcon : editedUserIcon}
              />
              <UserNameArea>
                <UserName>{userName ? userName : "匿名のユーザー"}</UserName>
                <InputFileButton
                  onChange={handleImage}
                  child="写真を選ぶ"
                  style={{
                    width: "160px",
                    left: "10px",
                    fontSize: "1rem",
                  }}
                />
              </UserNameArea>
            </UserNameSection>
            <InputFormSection>
              <Label>
                ユーザーネーム
                <Input
                  data-testid="userNameInput"
                  placeholder="あなたの名前(必須)"
                  value={editedUserName}
                  name="userName"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(e);
                  }}
                />
              </Label>
              <Label>
                都道府県
                <Input
                  data-testid="userNameInput"
                  placeholder="あなたの住んでいる都道府県"
                  value={editedPrefecture}
                  name="prefecture"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(e);
                  }}
                ></Input>
              </Label>
              <Label>
                お仕事
                <Input
                  data-testid="userNameInput"
                  placeholder="あなたの現在のお仕事"
                  value={editedJob}
                  name="job"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(e);
                  }}
                ></Input>
              </Label>
              <Label>
                紹介文
                <Textarea
                  placeholder="あなた自身のことを紹介してみましょう。"
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    handleTextarea(e);
                  }}
                  value={editedIntroduction}
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
            </InputFormSection>
          </Main>
        </div>
      )}
    </>
  );
};

export default Profile;
