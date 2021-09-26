import React, { useState, useEffect,useRef } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/userSlice";
import { db } from "../../firebase";
import InfiniteScroll from "react-infinite-scroller";
import styled from "styled-components";
import mediaQuery from "styled-media-query";

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
  margin-bottom: 60px;
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
  const unsubscribes = useRef<Unsubscribe[]>([]);

  // NOTE >> 過去の投稿（5件）を読み込む関数を定義する。
  const postLoader = (time: number) => {
    db.collection("posts")
      .where("uid", "==", uid)
      .orderBy("timestamp", "desc")
      .startAfter(time)
      .limit(15)
      .onSnapshot((snapshot) => {
        handleSnapshot(snapshot);
      });
  };

  const unsubscribe = () => {
    db.collection("posts").where("uid", "==", uid).orderBy("timestamp", "desc");
  };

  // NOTE >> 初回の読み込みを行う関数を定義する。
  const initialLoad = () => {
    // NOTE >> 変数「unsubscribe」に関数unsubscribeを追加し、実行する
    // QUESTION >> onSnapshot()は一度実行したら、バックグラウンドでずっと監視と更新処理を続ける事に
    //             なるのだろうか？だとしたら、previousPostLoaderが起動するたび、onSnapshot()の
    //             バックグラウンド処理が増え続けていくことになるのであって、計算の負荷が急増してしまう。
    //             だから、previousPostLoader()をunsubscribesの配列に格納し、forEach()を使って、
    //             onSnapshot()の解除をループしているのだろうか？
    postLoader(currentTime);
    unsubscribes.current.push(unsubscribe);
  };

  // NOTE >> スクロール時に投稿（5件）を追加で読み込む関数を定義する。
  const additionalLoad = () => {
    if (posts.length > 0) {
      const lastPostedTime = posts[posts.length - 1].timestamp;
      postLoader(lastPostedTime);
      unsubscribes.current.push(unsubscribe);
    }
  };

  // NOTE >> onSnapshot()の監視・更新を解除するための関数を定義する。
  const clear = () => {
    unsubscribes.current.forEach((unsubscribe) => {
      unsubscribe();
    });
  };

  // NOTE >> added,removed,modifiedのそれぞれの変更種類に応じて、処理を切り分けるようにする。
  function handleSnapshot(snapshot: any) {
    let added: Post[] = [];
    let removed: Post[] = [];
    let modified: Post[] = [];
    console.log(snapshot.docChanges());
    snapshot.docChanges().forEach((change: any) => {
      const post = {
        // NOTE >> ドキュメントのIDはdoc.idで取得し、フィールドの値はスプレッド構文により、doc.data()を展開することで取得している。
        id: change.doc.id,
        ...change.doc.data(),
      } as Post;
      console.log(post);
      if (change.type === "added") {
        // NOTE >> onSnapshot()で「added」されるドキュメントは最新のものから並ぶ必要があるため、
        //         push()ではなく、unshift()を使用する。
        console.log(added);
        added.unshift(post);
        console.log(added);
      } else if (change.type === "removed") {
        removed.unshift(post);
      } else if (change.type === "modified") {
        modified.unshift(post);
      }
    });
    if (added.length > 0) {
      setPosts([...added, ...posts]);
    }
    if (removed.length > 0) {
      return;
    }
    if (modified.length > 0) {
      setPosts(
        posts.map((before: any) => {
          const after: Post | undefined = modified.find(
            (find) => find.id === before.id
          );
          if (after) {
            return after;
          } else {
            return before;
          }
        })
      );
    }
  }

  const [oldestPost, setOldestPost] = useState<Post>();
  // NOTE >> コレクション「posts」の中でtimestampの値が最小のドキュメント(最も古い投稿)のidを取得する。
  function getOldestPost() {
    db.collection("posts")
      .where("uid", "==", uid)
      .orderBy("timestamp", "desc")
      .limitToLast(1)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.docs.length > 0) {
          setOldestPost({
            id: querySnapshot.docs[0].id,
            caption: querySnapshot.docs[0].data().caption,
            imageUrl: querySnapshot.docs[0].data().imageUrl,
            timestamp: querySnapshot.docs[0].data().timestamp,
            userName: querySnapshot.docs[0].data().userName,
          });
        } else {
          return;
        }
      });
  }

  // NOTE >> コンポーネントのライフサイクルに応じた処理をuseEffect()で指定する。
  useEffect(() => {
    initialLoad();
    // NOTE >> Unmountの際に、onSnapshot()の監視・更新処理を解除するようにする。
    return () => {
      clear();
    };
  }, []);

  useEffect(() => {
    getOldestPost();
  });

  const hasMore = oldestPost
    ? // NOTE >> 現在、読み込みが完了しているpostsの中にoldestPostと同じidを持つpostが含まれていたら、
      //         false(追加読み込みを中止)を、含まれていなかったらtrue(追加読み込みを許可)を返す。
      !Boolean(posts.find((post: Post) => post.id === oldestPost.id))
    : false;

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
        <InfiniteScroll hasMore={false} loadMore={additionalLoad}>
          <PhotoList>
            {posts.map((post, index) => {
              return (
                <PhotoItem style={{ backgroundColor: "gray" }} key={index}>
                  <PhotoImage src={post.imageUrl} />
                </PhotoItem>
              );
            })}
            {justifyLastLine()}
          </PhotoList>
        </InfiniteScroll>
      </Main>
    </>
  );
};

export default Grid;
