import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { auth, provider, storage } from "../firebase";
import styles from "./Auth.module.css";
import {
  Button,
  Avatar,
  CssBaseline,
  FormControl,
  InputLabel,
  Input,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  withStyles,
  makeStyles,
  createStyles,
  Theme,
  Container,
} from "@material-ui/core";

import { red, brown } from "@material-ui/core/colors";
import { AccountCircle, MailOutline } from "@material-ui/icons";
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from "node:constants";

const RedButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(red[400]),
    backgroundColor: red[400],
    "&:hover": {
      backgroundColor: red[500],
    },
  },
}))(Button);

const BrownButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(brown[400]),
    backgroundColor: brown[400],
    "&:hover": {
      backgroundColor: brown[500],
    },
  },
}))(Button);

const useStyles = makeStyles({
  textField: {
    width: "100%",
    height: "50px",
    marginBottom: "20px",
    backgroundColor: "white",
    fontSize: "20px",
    borderRadius: "0px",
  },
  container: {
    margin: "0px",
    padding: "0px",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "left",
    height: "35px",
    paddingTop: "7px",
    lineHeight: "35px",
    fontSize: "18px",
  },
  avatar: {
    width: "35px",
    height: "35px",
    marginRight: "5px",
    backgroundColor: red[500],
  },
  mailOutline: {
    display: "block",
    margin: "30px auto",
    padding: "10px",
    borderRadius: "100%",
    backgroundColor: "#7b7769",
    fontSize: "50px",
    textAlign: "center",
    color: "#f9f9f5",
  },
  grid: {
    fontSize: "14px",
    textAlign: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: "44px",
  },
  toggleButton: {
    width: "80px",
  },
  margin: {
    margin: "20px",
  },
  login: {
    margin: "20px auto",
    height: "42px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  signUp: {
    margin: "20px auto",
    height: "42px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
  },
  guideButton: {
    width: "300px",
    margin: "5px auto",
  },
  testUserButton: {
    margin: "20px",
    width: "350px",
    height: "50px",
    fontSize: "16px",
  },
});

const Auth: React.FC = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

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
    }else if (!email && password) {
      alert("メールアドレスを入力してください");
    } else if (email && !password) {
      alert("パスワードを入力してください");
    } else {
      alert("メールアドレスとパスワードを入力してください");
    }
  };
  const toggleIsLogin = () => {
    setShowPassword(false);
    setIsLogin(!isLogin);
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

  const testUserLogin = async () => {
    await auth.signInWithEmailAndPassword("testUser@gmail.com", "350125go");
  };

  return (
    <>
      <header data-testid="header" className={styles.header}>
        <Container maxWidth="md" className={classes.headerContainer}>
          <Avatar data-testid="avatar" className={classes.avatar}>
            つ
          </Avatar>
          つぐもん
        </Container>
      </header>
      <div
        data-testid="main"
        className={isLogin ? styles.loginContainer : styles.signUpContainer}
      >
        <Container component="main" maxWidth="xs" className={styles.container}>
          {!isLogin && (
            <MailOutline
              data-testid="mail-icon"
              className={classes.mailOutline}
            />
          )}
          {!isLogin && (
            <Grid
              data-testid="guide-for-input"
              item
              xs={12}
              className={classes.grid}
            >
              メールアドレスとパスワードを入力して登録してください。
            </Grid>
          )}

          <form className={classes.form}>
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
                    <BrownButton
                      data-testid="toggle-button"
                      size="small"
                      className={classes.toggleButton}
                      variant="contained"
                      onClick={toggleShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? "隠す" : "表示する"}
                    </BrownButton>
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
                onClick={async () => {
                  try {
                    await signInEmail();
                  } catch (err) {
                    alert(err.message);
                  }
                }}
              >
                ログインする
              </Button>
            ) : (
              <RedButton
                fullWidth
                data-testid="sign-up"
                className={classes.signUp}
                variant="contained"
                color="primary"
                onClick={async () => {
                  try {
                    await signUpEmail();
                  } catch (err) {
                    alert(err.message);
                  }
                }}
              >
                この内容で登録する
              </RedButton>
            )}

            <div className={styles.loginGuide}>
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
              {isLogin && (
                <Button
                  data-testid="guide-for-password"
                  className={classes.guideButton}
                  disableRipple={true}
                  size="medium"
                >
                  パスワードが分からない場合
                </Button>
              )}
            </div>
          </form>
        </Container>
      </div>
      <footer
        data-testid="footer"
        className={isLogin ? styles.footer : styles.footer2}
      >
        <BrownButton
          data-testid="test-user-button"
          className={classes.testUserButton}
          onClick={testUserLogin}
          variant="contained"
          startIcon={<AccountCircle />}
        >
          テストユーザーでログインする
        </BrownButton>
      </footer>
    </>
  );
};

export default Auth;
