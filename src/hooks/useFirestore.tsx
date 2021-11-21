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
      .onSnapshot((snapshot) => {
        setOldestId(snapshot.docs[0].id);
      });
  }

  function getStartTime(){
    if(posts.length > 0){
      return posts[posts.length -1].timestamp;
    }else{
      return 9999999999999;
    }
  }

  useEffect(() => {
    getOldestId();
      const unsub = db
        .collection("posts")
        .where("uid", "==", uid)
        .orderBy("timestamp", "desc")
        .startAfter(getStartTime())
        .limit(3)
        .onSnapshot((snapshot) => {
          let documents: Post[] = [];
          snapshot.forEach((doc) => {
            const post = { id: doc.id, ...doc.data() } as Post;
            documents.push(post);
          });
          console.log(documents);
          documents.forEach((doc) => {
            setPosts(posts.filter((post) => post.id !== doc.id));
          });
          setPosts([...posts,...documents]);
        });
      return () => unsub();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [loadCount]);

  return { posts, oldestId };
};

export default useFirestore;
