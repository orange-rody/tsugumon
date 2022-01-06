import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../../firebase";
import Button from "../Parts/Button";
import styled from "styled-components";
import mediaQuery from "styled-media-query";

const mediaMobile = mediaQuery.lessThan("medium");

const Input = styled.input`
  display: block;
  width: 70%;
  height: 3rem;
  padding-left: 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
  :focus {
    outline: none;
    background-color: #e3f0ff;
  }
  ${mediaMobile`
width: 80%;
height:2rem;
`}
`;

const Password = styled.div`
  display: flex;
  width: calc(70% + 1rem);
  margin: 0 auto 2rem;
  ${mediaMobile`
width: calc(80% + 1rem);`}
`;

const Auth: React.FC = () => {
  const dispatch = useDispatch();
  const email = useRef<string>("");
  const emailAlert = useRef<string>("");
  const [emailRegistable, setEmailRegistable] = useState<boolean>(false);
  const password = useRef<string>("");
  const passwordAlert = useRef<string>("");
  const [passwordRegistable, setPasswordRegistable] = useState<boolean>(false);
  const userType = useRef<string>("");
  const [userTypeRegistable, setUserTypeRegistable] = useState<boolean>(false);
  const userTypeAlert = useRef<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // const [avatarImage, setAvatarImage] = useState("");
  // const fileTypes: string[] = ["image/png", "image/jpeg"];

  // const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file: File = e.target.files![0];
  //   if (file && fileTypes.includes(file.type)) {
  //     const reader = new FileReader();
  //     return new Promise((resolve, reject) => {
  //       reader.readAsDataURL(file);
  //       reader.onload = (e: ProgressEvent<FileReader>) => {
  //         const image = document.createElement("img");
  //         const originalImage = e.target!.result as string;
  //         image.src = originalImage;
  //         image.onload = () => {
  //           const canvas = document.createElement("canvas");
  //           const [MAX_WIDTH, IMG_WIDTH] = [640, image.naturalWidth];
  //           const scaleSize = MAX_WIDTH / IMG_WIDTH;
  //           [canvas.width, canvas.height] = [
  //             MAX_WIDTH,
  //             image.naturalHeight * scaleSize,
  //           ];
  //           const ctx = canvas.getContext("2d")!;
  //           ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  //           const compressedImage = ctx.canvas.toDataURL();
  //           compressedImage.length > originalImage.length
  //             ? resolve(compressedImage)
  //             : resolve(originalImage);
  //         };
  //       };
  //       reader.onerror = () => {
  //         reject(reader.error);
  //       };
  //     })
  //       .then((result) => {
  //         setAvatarImage(result as string);
  //       })
  //       .catch((error) => alert(error));
  //   } else {
  //     setAvatarImage("");
  //     alert("拡張子が「png」もしくは「jpg」の画像ファイルを選択してください。");
  //   }
  // };

  const minlength = 8;
  const maxlength = 20;
  const regexLowercase = /[a-z]/g;
  const regexUppercase = /[A-Z]/g;
  const regexNumber = /[0-9]/g;

  function checkEmail(e: React.FocusEvent<HTMLInputElement>) {
    if (email.current !== "") {
      setEmailRegistable(true);
    }else{
      setEmailRegistable(false);
      emailAlert.current = "メールアドレスを入力してください。";
    }
  }

  function checkPassword(e: React.FocusEvent<HTMLInputElement>) {
    if (
      password.current.length <= maxlength &&
      password.current.length >= minlength &&
      password.current.match(regexLowercase) &&
      password.current.match(regexUppercase) &&
      password.current.match(regexNumber)
    ) {
      setPasswordRegistable(true);
    } else if (
      (password.current.length > maxlength ||
        password.current.length < minlength) &&
      (!password.current.match(regexLowercase) ||
        !password.current.match(regexUppercase) ||
        !password.current.match(regexNumber))
    ) {
      setPasswordRegistable(false);
      passwordAlert.current =
        "パスワードの長さは、半角8文字以上から半角50文字以下です。<br>パスワードには、英大文字・英小文字・数字それぞれを最低1文字ずつ含む必要があります。";
    } else if (
      password.current.length > maxlength ||
      password.current.length < minlength
    ) {
      setPasswordRegistable(false);
      passwordAlert.current =
        "パスワードの長さは、半角8文字以上から半角50文字以下です。";
    } else {
      setPasswordRegistable(false);
      passwordAlert.current =
        "パスワードには、英大文字・英小文字・数字それぞれを最低1文字ずつ含む必要があります。";
    }
  }

  async function signUp() {
    await auth.createUserWithEmailAndPassword(email.current, password.current);
  }

  return (
    <main
      style={{
        height: "calc(100% - 3rem)",
        backgroundColor: "#eee",
      }}
    >
      <p
        style={{
          width: "80%",
          height: "4rem",
          margin: "0 auto",
          textAlign: "center",
          lineHeight: "4rem",
          borderBottom: "1px solid #ccc",
          fontSize: "1.5rem",
          letterSpacing: "0.2rem",
        }}
      >
        ユーザー登録
      </p>
      <form style={{ marginTop: "2rem" }}>
        <label
          htmlFor="email"
          style={{
            display: "block",
            width: "80%",
            margin: "0 auto 0.2rem",
            textAlign: "left",
            fontWeight: "bold",
          }}
        >
          メールアドレス
        </label>
        <Input
          id="email"
          type="email"
          data-testid="email"
          placeholder="例: username@tsugumon.com"
          style={{
            margin: "0 auto 5%",
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            email.current = e.target.value;
          }}
          onBlur = {(e:React.FocusEvent<HTMLInputElement>)=>{
            checkEmail(e);
          }}
        />
        <label
          htmlFor="password"
          style={{
            display: "block",
            width: "80%",
            margin: "0 auto 0.2rem",
            textAlign: "left",
            fontWeight: "bold",
          }}
        >
          パスワード
        </label>
        <Password>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            data-testid="password"
            placeholder="8文字~20文字で入力してください"
            required
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              password.current = e.target.value;
            }}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              checkPassword(e);
            }}
            style={{
              margin: 0,
              width: "80%",
              borderRadius: "10px 0 0 10px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
            style={{
              width: "20%",
              margin: 0,
              borderRadius: "0 10px 10px 0",
              borderTop: "1px solid #aaa",
              borderLeft: "none",
              borderRight: "1px solid #aaa",
              borderBottom: "1px solid #aaa",
            }}
          >
            {showPassword ? "隠す" : "表示"}
          </button>
        </Password>
        <label
          htmlFor="email"
          style={{
            display: "block",
            width: "80%",
            margin: "0 auto 0.6rem",
            textAlign: "left",
            fontWeight: "bold",
          }}
        >
          利用の仕方（どちらかを選択）
        </label>
        <input
          type="radio"
          id="enterprise"
          name="user-type"
          value="enterprise"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            userType.current = e.target.value;
            setUserTypeRegistable(true);
          }}
        />
        <label
          htmlFor="enterprise"
          style={{
            display: "block",
            width: "80%",
            margin: "0 auto 0.6rem",
            textAlign: "left",
            fontWeight: "bold",
          }}
        >
          働き手を探す
        </label>
        <input
          type="radio"
          id="personal"
          name="user-type"
          value="personal"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            userType.current = e.target.value;
            setUserTypeRegistable(true);
          }}
        />
         <label
          htmlFor="personal"
          style={{
            display: "block",
            width: "80%",
            margin: "0 auto 0.6rem",
            textAlign: "left",
            fontWeight: "bold",
          }}
        >
          仕事を探す
        </label>
        <Button
          dataTestId="sign-up"
          variant="contained"
          disabled={!emailRegistable || !passwordRegistable || !userTypeRegistable}
          onClick={() => {
            signUp();
          }}
          color="primary"
          style={{
            position: "absolute",
            width: "80%",
            bottom: "1rem",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          この内容で登録する
        </Button>
      </form>
    </main>
  );
};

export default Auth;
