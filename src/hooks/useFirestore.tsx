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

  // NOTE >> コレクション「posts」の中で最も古い投稿のidを取得する。
  function getOldestId(isMounted: boolean) {
    ref
      .orderBy("timestamp", "desc")
      .limitToLast(1)
      .onSnapshot((snapshot) => {
        isMounted && setOldestId(snapshot.docs[0].id);
      });
  }

  useEffect(
    () => {
      let isMounted = true;
      const unsubscribe = ref
        .orderBy("timestamp", "desc")
        .limit(loadCount * 6)
        .onSnapshot((docs) => {
          // NOTE >> uploadPostsには空の配列をいれておいて、ドキュメントが
          //         更新されるたびに、要素を足していくようにする。
          let uploadPosts: Post[] = [];
          // NOTE >> filteredPostsにはpostsの中身を入れておいて、要素が追加
          //         されるたびに、重複する要素を消していくようにする。
          let filteredPosts: Post[] = posts;
          for (let change of docs.docChanges()) {
            if (change.type === "added") {
              console.log(`add:${change.doc.data().caption}`);
            } else if (change.type === "removed") {
              console.log(`remove:${change.doc.data().caption}`);
              filteredPosts = filteredPosts.filter(
                (x) => x.id !== change.doc.id
              );
            } else if (change.type === "modified") {
              console.log(`modify:${change.doc.data().caption}`);
            }
          }
          docs.forEach((doc) => {
            filteredPosts = filteredPosts.filter((x) => x.id !== doc.id);
            uploadPosts.push({ id: doc.id, ...doc.data() } as Post);
          });
          let tunedPosts: Post[] = [...filteredPosts, ...uploadPosts].sort(
            (a, b) => {
              return b.timestamp - a.timestamp;
            }
          );
          isMounted && setPosts(tunedPosts);
          // NOTE >> 最後の行が3未満だった際、不足分を再度取得するようにする。
          let deficit: number = loadCount * 6 - tunedPosts.length;
          if (deficit > 0) {
            ref
              .orderBy("timestamp", "desc")
              .startAfter(tunedPosts[tunedPosts.length - 1].timestamp)
              .limit(deficit)
              .onSnapshot((snapshots) => {
                snapshots.forEach((snapshot) => {
                  tunedPosts.push({
                    id: snapshot.id,
                    ...snapshot.data(),
                  } as Post);
                });
              });
            isMounted && setPosts(tunedPosts);
          }
        });
      getOldestId(isMounted);

      return () => {
        isMounted = false;
        unsubscribe();
        console.log(`isMounted: ${isMounted}`);
      };
    },
    
    [loadCount]
  );
  return { posts, oldestId };
};

export default useFirestore;
