import React, { useState } from "react";
import firebase from "firebase";
import {storage} from "../../firebase";

type MyFile = File;

export default function App() {
  const [image, setImage] = useState<MyFile>();
  const [imageUrl, setImageUrl] = useState<string | ArrayBuffer | null>("");

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const FileList: FileList | null = e.target.files;
    if (FileList) {
      const array = Array.from(FileList);
      const file = array.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )[0];
      setImage(file);
      console.log(file);
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        setImageUrl(reader.result);
      });
    }
  };

  const onUpload = (e:any) => {
    e.preventDefault();
    if (image) {
      console.log(image.name);
      const image_name = image.name;
      const storageRef = storage.ref().child("images/" + image_name);
      console.log(storageRef);
      storageRef.put(image).then(() => {
        console.log(`${image_name}のアップロードが完了しました。`);
      });
    }
  };

  return (
    <div className="App">
      <h1>画像アップロード</h1>
      <form>
        <input type="file" onChange={handleImage} />
        <button onClick={onUpload}>Upload</button>
      </form>
      {/* <img src={imageUrl} alt="uploader" /> */}
    </div>
  );
}
