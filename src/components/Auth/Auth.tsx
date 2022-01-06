import React, { useState, useRef } from "react";
import { auth } from "../../firebase";
import Wrapper from "../Parts/Wrapper";
import PaperContainer from "../Parts/PaperContainer";
import Header from "../Parts/Header";
import Button from "../Parts/Button";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core";
import mediaQuery from "styled-media-query";
import SignUp from "./SignUp";

const mediaMobile = mediaQuery.lessThan("medium");

const Title = styled.p`
  width: 90%;
  height: 52px;
  margin: 0 auto;
  font-size: 16px;
  line-height: 52px;
  color: hsl(0, 0%, 10%);
  font-weight: bold;
  text-align: center;
  letter-spacing: 2px;
`;

const Footer = styled.form`
  width: 100vw;
  display: flex;
  justify-content: center;
`;

const useStyles = makeStyles({
  textField: {
    width: "100%",
    height: "42px",
    margin: "0px auto 15px",
    backgroundColor: "white",
    fontSize: "15px",
    borderRadius: "0px",
  },

  accordion: {
    marginTop: "20px",
    marginBottom: "40px",
    width: "100%",
    fontSize: "14px",
    border: "1px solid #eee",
  },
  accordionDetails: {
    height: "60px",
    fontSize: "14px",
    marginBottom: "15px",
  },
});

const Auth: React.FC = () => {
  // const classes = useStyles();
  // const email = useRef("");
  // const password = useRef("");
  // const [registMode, setRegistMode] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);

  // const testUserLogin = async () => {
  //   await auth.signInWithEmailAndPassword("testUser@gmail.com", "350125go");
  // };

  // const logIn = async () => {
  //   if (email && password) {
  //     await auth.signInWithEmailAndPassword(email.current, password.current);
  //   } else if (!email && password) {
  //     alert("メールアドレスを入力してください");
  //   } else if (email && !password) {
  //     alert("パスワードを入力してください");
  //   } else {
  //     alert("メールアドレスとパスワードを入力してください");
  //   }
  // };
  // const signUp = async () => {
  //   if (email && password) {
  //     await auth.createUserWithEmailAndPassword(
  //       email.current,
  //       password.current
  //     );
  //   } else if (!email && password) {
  //     alert("メールアドレスを入力してください");
  //   } else if (email && !password) {
  //     alert("パスワードを入力してください");
  //   } else {
  //     alert("メールアドレスとパスワードを入力してください");
  //   }
  // };
  // const toggle = () => {
  //   setRegistMode(!registMode);
  //   setShowPassword(false);
  //   // EmailとPasswordのstateを初期化
  //   email.current = "";
  //   password.current = "";
  // };

  return (
    <Wrapper>
      <PaperContainer>
        <Header data-testid="header" style={{position: "relative"}}>
          <Title>つぐもん</Title>
        </Header>
<SignUp />
        {/* <Main>
          {!registMode && (
            <p
              style={{
                width: "40%",
                height: "52px",
                margin: "72px auto 20px",
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "normal",
                letterSpacing: "2px",
              }}
            >
              ログイン
            </p>
          )}
          <form>
            <input
              type="email"
              data-testid="email"
              placeholder="メールアドレス"
              style={{
                display: "block",
                width: "85%",
                height: "40px",
                margin: "20px auto",
                paddingLeft: "1rem",
                borderRadius: "10px",
                border: "1px solid #ccc",
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                email.current = e.target.value;
              }}
            />
            <div
              style={{
                margin: "0 auto",
                display: "flex",
                width: "calc(85% + 1rem)",
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                data-testid="password"
                placeholder="パスワード"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  password.current = e.target.value;
                }}
                style={{
                  display: "block",
                  width: "85%",
                  height: "40px",
                  margin: 0,
                  paddingLeft: "1rem",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              />

              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  setShowPassword(!showPassword);
                }}
                style={{
                  width: "15%",
                  margin: 0,
                  borderRadius: "5px",
                  border: "1px solid #aaa",
                }}
              >
                {showPassword ? "隠す" : "表示"}
              </button>
            </div>
          </form>
          {!registMode ? (
            <Button
              dataTestId="login"
              variant="contained"
              onClick={() => {
                logIn();
              }}
            >
              ログインする
            </Button>
          ) : (
            <Button
              dataTestId="sign-up"
              variant="contained"
              color="primary"
              onClick={() => {
                signUp();
              }}
            >
              この内容で登録する
            </Button>
          )}
          <div>
            <Button
              dataTestId="guide-for-sign-up"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                toggle();
              }}
              variant="contained"
            >
              {registMode
                ? "ログイン画面に戻る"
                : "ユーザー登録をされていない方はこちら"}
            </Button>
          </div>
        </Main> */}

        <Footer data-testid="footer">
          {/* <Button
          data-testid="test-user-button"
          className={classes.testUserButton}
          onClick={testUserLogin}
          variant="contained"
          startIcon={<AccountCircle />}
        >
          テストユーザーでログイン
        </Button> */}
        </Footer>
      </PaperContainer>
    </Wrapper>
  );
};

export default Auth;
