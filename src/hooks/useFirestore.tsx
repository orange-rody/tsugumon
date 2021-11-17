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


const useFirestore = (collection: string) => {
  const user = useSelector(selectUser);
  const uid = user.uid;
    
  const [oldestId, setOldestId] = useState<string>("");
  const [posts, setPosts ] = useState<Post[]>([]);
  
  function getOldestId() {
    db.collection("posts")
      .where("uid", "==", uid)
      .orderBy("timestamp", "desc")
      .limitToLast(1)
      .get()
      .then((documents) => setOldestId(documents.docs[0].id));
  }

  useEffect(() => {
    const unsub = db
      .collection("posts")
      .where("uid", "==", uid)
      .orderBy("timestamp", "desc")
      .limit(15)
      .onSnapshot((snapshot) => {
        let documents: Post[] = [];
        snapshot.forEach((doc) => {
          const post = {id:doc.id,...doc.data()} as Post;
          documents.push(post);
        });
        setPosts(documents);
      });
    return () => unsub();
  }, []);
  return { posts, oldestId };
};

export default useFirestore;
