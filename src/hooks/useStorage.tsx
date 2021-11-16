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
      console.log(dataUrl);
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
          (err) => console.log(err),
          async () => {
            const downloadUrl = await storageRef
              .child(`posts/${filename}`)
              .getDownloadURL();
            db.collection("posts").add({
              uid: user.uid,
              userName: user.userName,
              imageUrl: downloadUrl,
              caption: caption,
              timestamp: new Date().getTime(),
            });
            setUrl(downloadUrl);
          }
        );
    }
  }, [filename]);
  return { progress, url };
};

export default useStorage;
