import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { db } from "../../firebase";
import EditProfile from "./EditProfile";
import Header from "../Parts/Header";
import IconButton from "../Parts/IconButton";
import ColorButton from "../Parts/ColorButton";
import GridList from "./GridList";
import styled from "styled-components";
import { makeStyles, createStyles, Theme } from "@material-ui/core";
import {
  Settings,
  ViewComfy,
  ViewDay,
  LocalOffer,
  DateRange,
} from "@material-ui/icons";
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
    selected: {
      color: "#50a0d0",
      transitionProperty: "all",
      transitionDuration: "0.3s",
      transitionTimingFunction: "ease",
    },
    unselected: {
      color: "#ccc",
    },
  })
);

const iconStyle = { margin: "4px auto 0", padding: 0, fontSize: "25px" };

const DisplayTypeData = [
  { value: "grid", title: "小さく表示", icon: "GRID" },
  { value: "single", title: "大きく表示", icon: "SINGLE" },
  { value: "tag", title: "タグ", icon: "TAG" },
  { value: "calendar", title: "カレンダー", icon: "CALENDAR" },
];

function getDisplayTypeIcon(icon: string) {
  switch (icon) {
    case "GRID":
      return <ViewComfy style={iconStyle} />;
    case "SINGLE":
      return <ViewDay style={iconStyle} />;
    case "TAG":
      return <LocalOffer style={iconStyle} />;
    case "CALENDAR":
      return <DateRange style={iconStyle} />;
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const Main = styled.main`
  width: 30vw;
  ${mediaMobile`
    width: 100vw
  `};
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
    width: 90%;
  `}
  padding: 5px;
  height: 120px;
  margin: 10px auto;
  overflow: hidden;
  }
`;

const UserIcon = styled.img`
  width: 80px;
  height: 80px;
  margin: 20px 10px 10px 10px;
  border-radius: 100%;
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

const DisplayTypeList = styled.ul`
  display: flex;
  width: 100%;
  height: 50px;
  margin: 0;
  padding: 0;
  flex-direction: row;
  border-bottom: 1px solid silver;
`;

const DisplayType = styled.label`
  display: flex;
  width: 25%;
  height: 60px;
  margin: 0;
  flex-direction: column;
  box-sizing: border-box;
`;

const DisplayTypeName = styled.p`
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  text-align: center;
  font-size: 0.6rem;
`;

const Profile: React.FC = () => {
  interface Post {
    id: string;
    caption: string;
    imageUrl: string;
    timestamp: number;
    userName: string;
  }

  const user = useSelector(selectUser);
  const { uid, userName, userIcon, prefecture, job, introduction } = user;
  const [selectedType, setSelectedType] = useState<string>("grid");
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [oldestPostId, setOldestPostId] = useState("");
  const [loading, setLoading] = useState(false);

  function getOldestPostId() {
    db.collection("posts")
      .where("uid", "==", uid)
      .orderBy("timestamp", "desc")
      .limitToLast(1)
      .get()
      .then((snapshot) => {
        if (snapshot) {
          setOldestPostId(snapshot.docs[0].id);
        }
      });
  }

  function unsubscribe() {
    db.collection("posts").where("uid", "==", uid).orderBy("timestamp", "desc");
  }

  function postLoader(time: number) {
    try {
      db.collection("posts")
        .where("uid", "==", uid)
        .orderBy("timestamp", "desc")
        .startAfter(time)
        .limit(15)
        .onSnapshot((snapshot) => {
          handleSnapshot(snapshot);
          console.log("postLoaderが実行されました");
        });
    } catch (error) {
      alert(error);
    }
  }

  function handleSnapshot(snapshot: any) {
    let added: Post[] = [];
    let removed: Post[] = [];
    let modified: Post[] = [];
    snapshot.docChanges().forEach((change: any) => {
      const post = {
        id: change.doc.id,
        ...change.doc.data(),
      } as Post;
      if (change.type === "added") {
        added.push(post);
      } else if (change.type === "removed") {
        removed.push(post);
      } else if (change.type === "modified") {
        modified.push(post);
      }
    });
    if (added.length > 0) {
      setPosts([...posts, ...added]);
    } else if (removed.length > 0) {
      return;
    } else if (modified.length > 0) {
      setPosts((prev) => {
        return prev.map((before: Post) => {
          const after: Post | undefined = modified.find(
            (find) => find.id === before.id
          );
          if (after) {
            return after;
          } else {
            return before;
          }
        });
      });
    }
  }

  const noUserIcon = `${process.env.PUBLIC_URL}/noUserIcon.png`;
  const classes = useStyles();

  function openEdit() {
    setEditProfile(true);
  }
  function closeEdit() {
    setEditProfile(false);
  }

  return (
    <>
      {!editProfile ? (
        <Wrapper>
          <Header
            child={userName ? userName : "匿名のユーザー"}
            style={{ zIndex: 3 }}
          >
            <IconButton
              onClick={(e: React.MouseEvent<HTMLElement>) =>
                console.log(userName)
              }
              dataTestId="settings"
            >
              <Settings className={classes.settingIcon} />
            </IconButton>
          </Header>
          <div style={{ width: "100%", height: "52px", margin: "0px" }} />
          <Main>
            <UserNameSection>
              <UserIcon src={user.userIcon === "" ? noUserIcon : userIcon} />
              <UserNameArea>
                <UserName>{userName ? userName : "匿名のユーザー"}</UserName>
                <ColorButton
                  dataTestId="profileEditButton"
                  onClick={openEdit}
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
            <DisplayTypeList>
              {DisplayTypeData.map((data) => {
                return (
                  <DisplayType
                    className={
                      selectedType === data.value
                        ? classes.selected
                        : classes.unselected
                    }
                    key={data.value}
                    data-testid={data.value}
                  >
                    {getDisplayTypeIcon(data.icon)}
                    <input
                      type="radio"
                      name="type"
                      style={{ appearance: "none" }}
                      value={data.value}
                      aria-label={data.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSelectedType(data.value);
                      }}
                    />
                    <DisplayTypeName>{data.title}</DisplayTypeName>
                  </DisplayType>
                );
              })}
            </DisplayTypeList>
            {selectedType === "grid" ? <GridList /> : <div></div>}
          </Main>
        </Wrapper>
      ) : (
        <EditProfile
          closeWindow={
            // () => {
            closeEdit()
            // closeEdit()だけpropsとして渡すと、その時点で
          // }
        }
        />
      )}
    </>
  );
};
export default Profile;
