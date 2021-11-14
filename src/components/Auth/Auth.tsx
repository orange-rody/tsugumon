import React, { useState } from "react";
import { auth } from "../../firebase";
import styled from "styled-components";
import {
  Button,
  Avatar,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Grid,
  makeStyles,
  Container,
} from "@material-ui/core";

import { AccountCircle, MailOutline } from "@material-ui/icons";
import useMedia from "use-media";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: hsl(199, 59%, 80%);
`;

const Header = styled.header`
  width: 100vw;
  height: 46px;
  background-color: hsl(0, 0%, 100%);
  border-bottom: 1px solid hsla(26, 100%, 12%, 0.2);
  box-sizing: border-box;
`;

const Main = styled.main`
  display: flex;
  width: 100vw;
  margin-top: 0;
  border-bottom: 1px solid rgba(64, 28, 0, 0.2);
  box-sizing: border-box;
  background-color: hsl(199, 89%, 96%);
`;

const Form = styled.form`
  width: 100%;
  margin-top: 30px;
`;

const Footer = styled.form`
  width: 100vw;
  display: flex;
  justify-content: center;
`;

const useStyles = makeStyles({
  headerContainer: {
    display: "flex",
    justifyContent: "left",
    height: "30px",
    paddingTop: "7px",
    lineHeight: "30px",
    fontSize: "1rem",
  },
  textField: {
    width: "100%",
    height: "42px",
    margin: "0px auto 15px",
    backgroundColor: "white",
    fontSize: "15px",
    borderRadius: "0px",
  },
  container: {
    margin: "0px",
    padding: "0px",
  },
  avatar: {
    width: "30px",
    height: "30px",
    marginRight: "5px",
    backgroundColor: "#f00",
  },
  mailOutlinePC: {
    display: "block",
    margin: "15px auto",
    padding: "8px",
    borderRadius: "100%",
    backgroundColor: "#7b7769",
    fontSize: "3.2rem",
    textAlign: "center",
    color: "#f9f9f5",
  },
  mailOutlineMobile: {
    display: "block",
    margin: "10px auto",
    padding: "10px",
    borderRadius: "100%",
    backgroundColor: "#7b7769",
    fontSize: "2rem",
    textAlign: "center",
    color: "#f9f9f5",
  },
  gridPC: {
    fontSize: "1rem",
    textAlign: "center",
  },
  gridMobile: {
    fontSize: "0.7rem",
    textAlign: "center",
  },
  toggleButton: {
    width: "80px",
    height: "25px",
    fontSize: "13px",
  },
  login: {
    margin: "12px auto",
    height: "42px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  signUp: {
    margin: "12px auto",
    height: "42px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
  },
  guideButton: {
    left: "50%",
    width: "300px",
    transform: "translateX(-50%)",
    marginTop: "20px",
    backgroundColor: "hsl(0,0%,100%)",
    color: "hsl(199,89%,29%)",
    border: "1px solid hsl(199,89%,29%)",
  },
  testUserButton: {
    margin: "20px",
    width: "350px",
    height: "50px",
    fontSize: "16px",
    backgroundColor: "hsl(0,0%,100%)",
    color: "hsl(199,89%,29%)",
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
  // modal: {
  //   outline: "none",
  //   position: "absolute",
  //   width: "400px",
  //   borderRadius: "10px",
  //   backgroundColor: "#fff",
  //   padding: "20px",
  // },
});

const Auth: React.FC = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  // const [openModal, setOpenModal] = useState(false);
  // const [resetEmail, setResetEmail] = useState("");

  // const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
  //   await auth
  //     .sendPasswordResetEmail(resetEmail)
  //     .then(() => {
  //       setOpenModal(false);
  //       setResetEmail("");
  //     })
  //     .catch((err) => {
  //       alert(err.message);
  //       setResetEmail("");
  //     });
  // };

  const testUserLogin = async () => {
    await auth.signInWithEmailAndPassword("testUser@gmail.com", "350125go");
  };

  const signInEmail = async () => {
    if (email && password) {
      await auth.signInWithEmailAndPassword(email, password);
    } else if (!email && password) {
      alert("メールアドレスを入力してください");
    } else if (email && !password) {
      alert("パスワードを入力してください");
    } else {
      alert("メールアドレスとパスワードを入力してください");
    }
  };
  const signUpEmail = async () => {
    if (email && password) {
      await auth.createUserWithEmailAndPassword(email, password);
    } else if (!email && password) {
      alert("メールアドレスを入力してください");
    } else if (email && !password) {
      alert("パスワードを入力してください");
    } else {
      alert("メールアドレスとパスワードを入力してください");
    }
  };
  const toggleIsLogin = () => {
    setIsLogin(!isLogin);
    setShowPassword(false);
    // EmailとPasswordのstateを初期化
    setEmail("");
    setPassword("");
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  //mousedown イベントは、要素の中にあるボタンが押下されたときに発火します 。
  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };
  const loginContainer = {
    height: "320px",
  };
  const signUpContainer = {
    height: "420px",
  };
  const isWide = useMedia({ minWidth: "481px" });

  return (
    <Wrapper>
      <Header data-testid="header">
        <Container maxWidth="md" className={classes.headerContainer}>
          <Avatar data-testid="avatar" className={classes.avatar}>
            つ
          </Avatar>
          つぐもん
        </Container>
      </Header>
      <Main style={isLogin ? loginContainer : signUpContainer}>
        <Container component="main" maxWidth="xs">
          {!isLogin && (
            <MailOutline
              data-testid="mail-icon"
              className={
                isWide ? classes.mailOutlinePC : classes.mailOutlineMobile
              }
            />
          )}
          {!isLogin && (
            <Grid
              data-testid="guide-for-input"
              item
              xs={12}
              className={isWide ? classes.gridPC : classes.gridMobile}
            >
              メールアドレスとパスワードを登録してください。
            </Grid>
          )}

          <Form>
            <FormControl className={classes.textField} variant="outlined">
              <InputLabel htmlFor="email">メールアドレス</InputLabel>
              <OutlinedInput
                data-testid="email"
                className={classes.textField}
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value);
                }}
                labelWidth={100}
              />
            </FormControl>
            <FormControl className={classes.textField} variant="outlined">
              <InputLabel htmlFor="password">パスワード</InputLabel>
              <OutlinedInput
                id="password"
                data-testid="password"
                className={classes.textField}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <Button
                      data-testid="toggle-button"
                      size="small"
                      className={classes.toggleButton}
                      variant="contained"
                      onClick={toggleShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? "隠す" : "表示"}
                    </Button>
                  </InputAdornment>
                }
                labelWidth={80}
              />
            </FormControl>
            {isLogin ? (
              <Button
                fullWidth
                data-testid="login"
                className={classes.login}
                variant="contained"
                onClick={() => {
                  signInEmail();
                }}
              >
                ログインする
              </Button>
            ) : (
              <Button
                fullWidth
                data-testid="sign-up"
                className={classes.signUp}
                variant="contained"
                color="primary"
                onClick={() => {
                  signUpEmail();
                }}
              >
                この内容で登録する
              </Button>
            )}

            <div>
              <Button
                data-testid="guide-for-sign-up"
                className={classes.guideButton}
                disableRipple={true}
                onClick={toggleIsLogin}
                size="medium"
              >
                {isLogin
                  ? "ユーザー登録をされていない方はこちら"
                  : "ログイン画面に戻る"}
              </Button>
              {/* {isLogin && (
                <Accordion
                  className={classes.accordion}
                  square={true}
                  data-testid="guide-for-password"
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    パスワードが分からない場合
                  </AccordionSummary>
                  <AccordionDetails className={classes.accordionDetails}>
                    <Button>
                      ・こちらでパスワードの再設定をおこないます。
                    </Button>
                  </AccordionDetails>
                </Accordion>
              )}
              <span /> */}
            </div>
          </Form>
        </Container>
      </Main>
      <Footer data-testid="footer">
        <Button
          data-testid="test-user-button"
          className={classes.testUserButton}
          onClick={testUserLogin}
          variant="contained"
          startIcon={<AccountCircle />}
        >
          テストユーザーでログイン
        </Button>
      </Footer>
    </Wrapper>
  );
};

export default Auth;
