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

  // NOTE >> コレクション「posts」の中でtimestampの値が
  //         最小のドキュメント(最も古い投稿)のidを取得する。
  function getOldestId() {
    db.collection("posts")
      .where("uid", "==", uid)
      .orderBy("timestamp", "desc")
      .limitToLast(1)
      .get()
      .then((documents) => setOldestId(documents.docs[0].id));
  }

  useEffect(() => {
    getOldestId();
    if (posts.length === 0) {
      const unsub = db
        .collection("posts")
        .where("uid", "==", uid)
        .orderBy("timestamp", "desc")
        .limit(15)
        .onSnapshot((snapshot) => {
          let documents: Post[] = [];
          snapshot.forEach((doc) => {
            const post = { id: doc.id, ...doc.data() } as Post;
            documents.push(post);
          });
          console.log(posts);
          setPosts(documents);
        });
      return () => unsub();
    } 
    else {
      // NOTE >> postsのstateに値が登録されていた場合、
      //         過去の投稿（15件）を読み込む関数を定義する。
      const lastPostedTime = posts[1].timestamp;
      const unsub = db
        .collection("posts")
        .where("uid", "==", uid)
        .orderBy("timestamp", "desc")
        .startAfter(lastPostedTime)
        .limit(15)
        .onSnapshot((snapshot) => {
          let documents: Post[] = [];
          snapshot.forEach((doc) => {
            const post = { id: doc.id, ...doc.data() } as Post;
            documents.push(post);
            console.log(posts);
            setPosts((prev) => [...prev, ...documents]);
          });
        });
      return () => unsub();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadCount]);
  return { posts, oldestId };
};

export default useFirestore;
