import { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

const useStorage = (dataUrl: string, caption: string, filename: string) => {
  const [url, setUrl] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const user = useSelector(selectUser);

  useEffect(() => {
    // NOTE >> dataUrlをStorageに登録する
    if (dataUrl !== "") {
      const storageRef = storage.ref();
      storageRef
        .child(`posts/${filename}`)
        .putString(dataUrl, "data_url")
        .on(
          "state_changed",
          (snapshot) => {
            let percentage =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(percentage);
          },
          (err) => alert(err),
          async () => {
            const downloadUrl = await storageRef
              .child(`posts/${filename}`)
              .getDownloadURL();
            db.collection("posts").add({
              uid: user.uid,
              username: user.username ? user.username : "",
              imageUrl: downloadUrl,
              caption: caption,
              timestamp: new Date().getTime(),
            });
            setUrl(downloadUrl);
          }
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filename]);
  return { progress, url };
};

export default useStorage;
