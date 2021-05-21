import React, { useState } from "react";
import { storage } from "../../firebase";

export default function App() {
  const [image, setImage] = useState<File | null>();
  const [imageUrl, setImageUrl] = useState<string | undefined>("");

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const FileList: FileList | null = e.target.files;
    if (FileList) {
      const file: File | null = FileList.item(0);
      setImage(file);
      console.log(file);
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          // 画像ファイルを base64 文字列に変換します
          setImageUrl(reader.result as string);
        },
        false
      );

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

  // onUploadが呼び出される瞬間、なぜかサーバへの送信がスタートしてしまうので、
  // e.preventDefault()で規定の動作をキャンセルしています。
  const onUpload = (e: any) => {
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
      <img src={imageUrl} alt="uploader" />
    </div>
  );
}
