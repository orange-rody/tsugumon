import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { db } from "../../firebase";
import styled from "styled-components";
import mediaQuery from "styled-media-query";
import DefaultButton from "../Parts/DefaultButton";

const mediaMobile = mediaQuery.lessThan("medium");

const Main = styled.main`
  width: 100%;
  height: 100%;
  z-index: 6;
`;

const PhotoList = styled.ul`
  display: flex;
  width: 30vw;
  ${mediaMobile`
    width: 100%;
  `}
  height: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  padding-bottom: 60px;
  overflow: scroll;
  list-style: none;
`;

const PhotoItem = styled.li`
  width: 33%;
  margin-bottom: 2px;
  position: relative;
  &:before {
    content: "";
    display: block;
    padding-top: 100%;
  }
`;

const PhotoImage = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0:
  object-fit: cover;
`;

const Grid: React.FC = () => {
  interface Post {
    id: string;
    caption: string;
    imageUrl: string;
    timestamp: number;
    userName: string;
  }

  type Unsubscribe = () => void;

  const user = useSelector(selectUser);
  const uid = user.uid;
  const currentTime: number = new Date().getTime();
  const [posts, setPosts] = useState<Post[]>([]);
  const [oldestPostId, setOldestPostId] = useState("");
  const [loading, setLoading] = useState(false);
  const unsubscribes = useRef<Unsubscribe[]>([]);

  // NOTE >> コレクション「posts」の中でtimestampの値が最小のドキュメント(最も古い投稿)のidを取得する。
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

  const unsubscribe = () => {
    db.collection("posts").where("uid", "==", uid).orderBy("timestamp", "desc");
  };

  // NOTE >> 過去の投稿（15件）を読み込む関数を定義する。
  async function postLoader(time: number) {
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
      // NOTE >> 変数「unsubscribe」に関数unsubscribeを追加し、実行する
      // QUESTION >> onSnapshot()は一度実行したら、バックグラウンドでずっと監視と
      //             更新処理を続ける事になる。postLoaderが起動するたび、
      //             onSnapshot()のバックグラウンド処理が増え計算の負荷が増加して
      //             しまうため、forEach()を使って、unsubscribesに格納したonSnapshot()を
      //             解除するループを回している。
      unsubscribes.current.push(unsubscribe);
    } catch (e) {
      console.log(e);
    }
  }

  // NOTE >> added,removed,modifiedのそれぞれの変更種類に応じて、
  //         処理を切り分けるようにする。
  function handleSnapshot(snapshot: any) {
    let added: Post[] = [];
    let removed: Post[] = [];
    let modified: Post[] = [];
    snapshot.docChanges().forEach((change: any) => {
      const post = {
        // NOTE >> ドキュメントのIDはdoc.idで取得し、フィールドの値は
        //         スプレッド構文により、doc.data()を展開することで取得している。
        id: change.doc.id,
        ...change.doc.data(),
      } as Post;
      console.log(post);
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
    }
    if (removed.length > 0) {
      return;
    }
    if (modified.length > 0) {
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

  // NOTE >> 初回の読み込みを行う関数を定義する。
  function initialLoad() {
    setLoading(true);
    getOldestPostId();
    postLoader(currentTime).then(() => setLoading(false));
    unsubscribes.current.push(unsubscribe);
  }

  // NOTE >> 追加の読み込みを行う関数を定義する。
  function nextLoad() {
    setLoading(true);
    if (posts.length > 0) {
      if (posts.find((find) => find.id === oldestPostId)) {
        setLoading(false);
        console.log("You are up to date!");
      } else {
        const lastPostedTime = posts[posts.length - 1].timestamp;
        postLoader(lastPostedTime).then(() => setLoading(false));
      }
    }
  }

  // NOTE >> onSnapshot()の監視・更新を解除するための関数を定義する。
  const clear = () => {
    unsubscribes.current.forEach((unsubscribe) => {
      unsubscribe();
      console.log("clearが実行されました。");
    });
  };

  // async function checkHasMore() {
  //   await initialLoad();
  //   console.log("checkHasMore has been Called.");
  //   db.collection("posts")
  //     .where("uid", "==", uid)
  //     .orderBy("timestamp", "desc")
  //     .limitToLast(1)
  //     .get()
  //     .then((querySnapshot) => {
  //       if (querySnapshot.docs.length > 0) {
  //         console.log({
  //           id: querySnapshot.docs[0].id,
  //           caption: querySnapshot.docs[0].data().caption,
  //           imageUrl: querySnapshot.docs[0].data().imageUrl,
  //           timestamp: querySnapshot.docs[0].data().timestamp,
  //           userName: querySnapshot.docs[0].data().userName,
  //         });
  //         // NOTE >> 現在、読み込みが完了しているpostsの中にquerySnapshot.docs[0]と同じ
  //         //         idを持つpostが含まれていたら、false(追加読み込みを中止)を、含まれて
  //         //         いなかったらtrue(追加読み込みを許可)を返す。
  //         setHasMore(
  //           posts.find((post: Post) => post.id === querySnapshot.docs[0].id) ===
  //             undefined
  //         );
  //         console.log(
  //           `setHasMoreが実行されました。setHasMoreの結果は${hasMore}でした。`
  //         );
  //       } else {
  //         return;
  //       }
  //     });
  // }

  // NOTE >> コンポーネントのライフサイクルに応じた処理をuseEffect()で指定する。
  useEffect(() => {
    initialLoad();
    console.log(posts);
    // NOTE >> Unmountの際に、onSnapshot()の監視・更新処理を解除するようにする。
    return () => {
      clear();
    };
  }, []);

  const lastLine = posts.length % 3;
  function justifyLastLine() {
    switch (lastLine) {
      case 0:
        break;
      case 1:
        return (
          <>
            <PhotoItem />
            <PhotoItem />
          </>
        );
      case 2:
        return <PhotoItem />;
    }
  }

  return (
    <>
      <Main>
        <PhotoList>
          {posts.map((post, index) => {
            return (
              <PhotoItem style={{ backgroundColor: "gray" }} key={index}>
                <PhotoImage src={post.imageUrl} />
              </PhotoItem>
            );
          })}
          {justifyLastLine()}
          <div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <DefaultButton
                child="読み込む"
                onClick={nextLoad}
                dataTestId="buttonForLoading"
              />
            )}
          </div>
        </PhotoList>
      </Main>
    </>
  );
};

export default Grid;
