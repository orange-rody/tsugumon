import { useState, useEffect, useRef } from "react";
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
type Listener = () => void;

const useFirestore = (loadCount: number) => {
  const user = useSelector(selectUser);
  const uid: string = user.uid;
  const [oldestId, setOldestId] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const listeners = useRef<Listener[]>([]);

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

  function getPosts() {
    let listener = ref
      .orderBy("timestamp", "desc")
      .limit(6)
      .onSnapshot((snapshots) => {
        console.log(snapshots.docs.length);
        let end = snapshots.docs[snapshots.docs.length - 1].data().timestamp;
        console.log(snapshots.docs[snapshots.docs.length - 1].data().caption);
        let filteredPosts: Post[] = posts;
        let documents: Post[] = [];
        ref
          .orderBy("timestamp", "desc")
          .endAt(end)
          .onSnapshot((docs) => {
            for (let change of docs.docChanges()) {
              if (change.type === "added") {
                console.log(`${change.doc.data().caption}がaddされました`);
              } else if (change.type === "removed") {
                console.log(`${change.doc.data().caption}がremoveされました`);
              } else if (change.type === "modified") {
                console.log(`${change.doc.data().caption}がmodifyされました`);
              }
            }
            docs.forEach((doc) => {
              filteredPosts = filteredPosts.filter((x) => x.id !== doc.id);
              const post = { id: doc.id, ...doc.data() } as Post;
              documents.push(post);
            });
            console.log([...filteredPosts, ...documents]);
            setPosts(
              [...filteredPosts, ...documents].sort((a, b) => {
                return b.timestamp - a.timestamp;
              })
            );
            // posts.forEach((post)=>{
            //   console.log(post.caption);
            //   console.log(post.timestamp);
            // })
          });
      });
    // listener();
    // TODO >> setPosts()した後、listenerをリセットする方法を試す。
  }

  function getMorePosts() {
    let start = posts[posts.length - 1].timestamp;
    let listener = ref
      .orderBy("timestamp", "desc")
      .startAfter(start)
      .limit(6)
      .onSnapshot((snapshots) => {
        console.log(snapshots.docs);
        let end = snapshots.docs[snapshots.docs.length - 1].data().timestamp;
        ref
          .orderBy("timestamp", "desc")
          .startAfter(start)
          .endAt(end)
          .onSnapshot((docs) => {
            posts.forEach((post) => {
              console.log(post.id);
            });
            let filteredPosts: Post[] = posts;
            let documents: Post[] = [];
            console.log(docs.size);
            docs.forEach((doc) => {
              // console.log(doc.data);
              filteredPosts = filteredPosts.filter((x) => x.id !== doc.id);
              const post = { id: doc.id, ...doc.data() } as Post;
              documents.push(post);
            });
            setPosts(
              [...filteredPosts, ...documents].sort((a, b) => {
                return b.timestamp - a.timestamp;
              })
            );
            posts.forEach((post) => {
              console.log(post.caption);
            });
            // console.log(posts.length);
          });
        // listeners.current.push(innerListener);
      });
    listeners.current.push(listener);
    // console.log(posts.length);
  }

  useEffect(
    () => {
      getOldestId();
      getPosts();
      loadCount > 0 && getMorePosts();
      return () => {
        listeners.current.forEach((listener) => {
          listener();
          console.log("clearが実行されました。");
        });
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loadCount]
  );
  // console.log(posts);
  return { posts, oldestId };
};

export default useFirestore;
