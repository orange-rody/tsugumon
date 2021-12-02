/* eslint-disable no-loop-func */
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

interface Post {
  id: string;
  caption: string;
  imageUrl: string;
  timestamp: number;
  username: string;
}

const useFirestore = (loadCount: number) => {
  const user = useSelector(selectUser);
  const uid: string = user.uid;
  const [oldestId, setOldestId] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);

  const ref = db.collection("posts").where("uid", "==", uid);

  // NOTE >> コレクション「posts」の中でtimestampの値が
  //         最小のドキュメント(最も古い投稿)のidを取得する。
  function getOldestId() {
    ref
      .orderBy("timestamp", "desc")
      .limitToLast(1)
      .onSnapshot((snapshot) => {
        setOldestId(snapshot.docs[0].id);
      });
  }

  function getPosts(loadCount: number) {
    ref
      .orderBy("timestamp", "desc")
      .limit(loadCount * 6)
      .get()
      .then((snapshots) => {
        let backRowEnd =
          snapshots.docs[snapshots.docs.length - 1].data().timestamp;
        ref
          .orderBy("timestamp", "desc")
          .endAt(backRowEnd)
          .onSnapshot((docs) => {
            // NOTE >> filteredPostsにはpostsの中身を入れておいて、要素が追加
            //         されるたびに、重複する要素を消していくようにする。
            let filteredPosts: Post[] = posts;
            // NOTE >> uploadPostsには空の配列をいれておいて、ドキュメントが
            //         更新されるたびに、要素を足していくようにする。
            let uploadPosts: Post[] = [];
            for (let change of docs.docChanges()) {
              if (change.type === "added") {
                console.log(`${change.doc.data().caption}がaddされました`);
              } else if (change.type === "removed") {
                console.log(`${change.doc.data().caption}がremoveされました`);
                filteredPosts = filteredPosts.filter(
                  (x) => x.id !== change.doc.id
                );
              } else if (change.type === "modified") {
                console.log(`${change.doc.data().caption}がmodifyされました`);
              }
            }
            docs.forEach((doc) => {
              filteredPosts = filteredPosts.filter((x) => x.id !== doc.id);
              const post = {
                id: doc.id,
                ...doc.data(),
              } as Post;
              uploadPosts.push(post);
            });

            let tunedPosts: Post[] = [...filteredPosts, ...uploadPosts].sort(
              (a, b) => {
                return b.timestamp - a.timestamp;
              }
            );
            ref
              .orderBy("timestamp", "desc")
              .startAfter(tunedPosts[tunedPosts.length - 1].timestamp)
              .limit(3 - (tunedPosts.length % 3))
              .get()
              .then((snapshots) => {
                snapshots.forEach((snapshot) => {
                  const post = {
                    id: snapshot.id,
                    ...snapshot.data(),
                  } as Post;
                  tunedPosts.push(post);
                  console.log(tunedPosts);
                });
                console.log(tunedPosts);
                setPosts(tunedPosts);
              });
          });

        posts.forEach((post) => console.log(post.caption));
        // NOTE >> 前回行ったスナップショットの消去
        if (loadCount > 1) {
          let frontRowEnd =
            snapshots.docs[snapshots.docs.length - 7].data().timestamp;
          ref
            .orderBy("timestamp", "desc")
            .endAt(frontRowEnd)
            .onSnapshot(() => {});
          console.log("前回行ったスナップショットを消去しました。");
        }
      });
  }

  useEffect(
    () => {
      getOldestId();
      getPosts(loadCount);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loadCount]
  );
  console.log(`returnします。`);
  return { posts, oldestId };
};

export default useFirestore;
