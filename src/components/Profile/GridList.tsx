import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../features/userSlice";
import {
  selectOldestId,
  selectPosts,
  edit,
  getOldestId,
} from "../../features/postsSlice";
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

const ButtonArea = styled.div`
  width: 200px;
  height: 40px;
  margin: 0 auto;
  padding: 0;
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

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const uid = user.uid;
  const currentTime: number = new Date().getTime();
  const posts = useSelector(selectPosts);
  const oldestId = useSelector(selectOldestId);
  const unsubscribes = useRef<Unsubscribe[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // NOTE >> コレクション「posts」の中でtimestampの値が最小のドキュメント(最も古い投稿)のidを取得する。
  function getOldestPostId() {
    db.collection("posts")
      .where("uid", "==", uid)
      .orderBy("timestamp", "desc")
      .limitToLast(1)
      .get()
      .then((snapshot) => {
        if (snapshot) {
          dispatch(getOldestId(snapshot.docs[0].id));
        }
      });
  }

  // NOTE >> 過去の投稿（15件）を読み込む関数を定義する。
  function pastLoader(time: number) {
    try {
      const unSubPast = db
        .collection("posts")
        .where("uid", "==", uid)
        .orderBy("timestamp", "desc")
        .startAfter(time)
        .limit(15)
        .onSnapshot((snapshot) => {
          handleSnapshot(snapshot);
          console.log("pastLoaderが実行されました");
        });
      // NOTE >> onSnapshot()はバックグラウンドで監視と更新処理を
      //         続けるため、pastLoaderが起動するたび、バックグラウンド
      //         の計算の負荷が増加しまう。そのため、forEach()を使って、
      //         unsubscribesに格納したonSnapshot()を解除するループを
      //         回している。
      unsubscribes.current.push(unSubPast);
    } catch (error) {
      alert(error);
    }
  }

  function futureLoader(time: number) {
    try {
      const unSubFuture = db
        .collection("posts")
        .where("uid", "==", uid)
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          handleSnapshot(snapshot);
          console.log("futureLoaderが実行されました。");
        });
      unsubscribes.current.push(unSubFuture);
    } catch (error) {
      alert(error);
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
        // NOTE >> 配列を格納する変数(added)を作り、...postsとpostをごちゃ混ぜに
        //         入れ込む
      } else if (change.type === "removed") {
        removed.push(post);
      } else if (change.type === "modified") {
        modified.push(post);
      }

      if (added.length > 0) {
        console.log(posts);
        let addedPosts = [...added, ...posts];
        console.log(addedPosts[0].timestamp);

        let sortedPosts = addedPosts.sort((a, b) => b.timestamp - a.timestamp);
        // NOTE >> 配列のsortメソッドを使って、addedの各要素が新しい(=timestampが
        //         大きい)投稿→古い(=timestampが小さい)投稿の順に並ぶよう、
        //         bとaの順番を入れ替えている。
        dispatch(edit(sortedPosts));
        setCount((count) => count + 1);
      } else if (modified.length > 0) {
        let modifiedPosts = posts.map((before: Post) => {
          const after: Post | undefined = modified.find(
            (find) => find.id === before.id
          );
          if (after) {
            return after;
          } else {
            return before;
          }
        });
        dispatch(edit(modifiedPosts));
        setCount((count) => count + 1);
      }
    });
  }

  // NOTE >> 追加の読み込みを行う関数を定義する。
  function nextLoad() {
    setLoading(true);
    if (posts.length - 1 > 0) {
      const lastPostedTime = posts[posts.length - 1].timestamp;
      console.log(lastPostedTime);
      pastLoader(lastPostedTime);
      console.log(posts);
      setLoading(false);
    }
  }

  function showLoadButton() {
    if (posts.find((find) => find.id === oldestId)) {
      return (
        <ButtonArea>
          <p>最後まで読み込みました！</p>
        </ButtonArea>
      );
    } else {
      return (
        <ButtonArea>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <DefaultButton
              child="更に読み込む"
              onClick={nextLoad}
              dataTestId="buttonForLoading"
              wide={true}
            />
          )}
        </ButtonArea>
      );
    }
  }

  // NOTE >> onSnapshot()の監視・更新を解除するための関数を定義する。
  const clear = () => {
    unsubscribes.current.forEach((unsubscribe) => {
      unsubscribe();
      console.log("clearが実行されました。");
    });
  };

  // NOTE >> コンポーネントのライフサイクルに応じた処理をuseEffect()で指定する。
  useEffect(() => {
    // NOTE >> 初回の読み込みを行う関数を定義する。
    if (posts.length === 1) {
      setCount((count) => count + 1);
      setLoading(true);
      getOldestPostId();
      futureLoader(currentTime);
      pastLoader(currentTime);
      setLoading(false);
    }
    console.log(posts);
    // NOTE >> Unmountの際に、onSnapshot()の監視・更新処理を解除するようにする。
    return () => {
      clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  console.log("あ");
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
          {showLoadButton()}
        </PhotoList>
      </Main>
    </>
  );
};

export default Grid;
