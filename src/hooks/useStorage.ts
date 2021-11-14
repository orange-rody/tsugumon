import { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import {useSelector} from "react-redux";
import {selectUser} from "../features/userSlice";

const useStorage = (data: string, caption: string, filename: string) => {
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");

  const user = useSelector(selectUser);

  useEffect(() => {
    storage
      .ref(filename)
      .putString(data, "data_url")
      .on(
        "state_changed",
        (snapshot) => {
          let percentage =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(percentage);
          setProgress(percentage);
        },
        (err) => console.log(err),
        async () => {
          const downloadUrl = await storage.ref(filename).getDownloadURL();
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
  }, [filename]);

  return {progress, url};
};

export default useStorage;