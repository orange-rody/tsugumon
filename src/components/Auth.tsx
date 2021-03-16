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
  OutlinedInput,
  InputAdornment,
  TextField,
  IconButton,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  withStyles,
  makeStyles,
  Theme,
  Container,
} from "@material-ui/core";

import { red, brown } from "@material-ui/core/colors";
import { AccountCircle, MailOutline } from "@material-ui/icons";

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

const useStyles = makeStyles((theme) => ({
  textField: {
    width: "100%",
    marginTop: "20px",
    backgroundColor: "#fff",
    fontSize: "20px",
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
    margin: "35px auto",
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
    marginTop: theme.spacing(3),
  },
  button: {
    width: "80px",
  },
  margin: {
    margin: theme.spacing(1),
  },
  login: {
    margin: theme.spacing(3, 0, 3),
    height: "42px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  signUp: {
    margin: theme.spacing(3, 0, 3),
    height: "42px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
  },
  loginGuideButton: {
    width: "300px",
    margin: "5px auto",
  },
  testUserButton: {
    margin: theme.spacing(4),
    width: "350px",
    height: "50px",
    fontSize: "16px",
  },
}));

const Auth: React.FC = () => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };
  const signUpEmail = async () => {
    await auth.createUserWithEmailAndPassword(email, password);
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
      <header className={styles.header}>
        <Container maxWidth="md" className={classes.headerContainer}>
          <Avatar className={classes.avatar}>つ</Avatar>
          つぐもん
        </Container>
      </header>
      <div className={isLogin ? styles.loginContainer : styles.signUpContainer}>
        <Container component="main" maxWidth="xs" className={styles.container}>
          {!isLogin && <MailOutline className={classes.mailOutline} />}
          {!isLogin && (
            <Grid item xs={12} className={classes.grid}>
              メールアドレスとパスワードを入力して登録してください。
            </Grid>
          )}
          <form className={classes.form} noValidate>
            <TextField
              className={classes.textField}
              size="medium"
              variant="outlined"
              id="email"
              label="メールアドレス"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
              }}
            />
            <FormControl className={classes.textField} variant="outlined">
              <InputLabel htmlFor="password">パスワード</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <BrownButton
                      size="small"
                      variant="contained"
                      className={classes.button}
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
                variant="contained"
                className={classes.login}
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
                variant="contained"
                className={classes.signUp}
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
                disableRipple={true}
                onClick={toggleIsLogin}
                size="medium"
                className={classes.loginGuideButton}
              >
                {isLogin
                  ? "ユーザー登録をされていない方はこちら"
                  : "ログイン画面に戻る"}
              </Button>
              {isLogin && (
                <Button
                  disableRipple={true}
                  size="medium"
                  className={classes.loginGuideButton}
                >
                  パスワードが分からない場合
                </Button>
              )}
            </div>
          </form>
        </Container>
      </div>
      <footer className={isLogin ? styles.footer : styles.footer2}>
        <BrownButton
          onClick={testUserLogin}
          variant="contained"
          className={classes.testUserButton}
          startIcon={<AccountCircle />}
        >
          テストユーザーでログインする
        </BrownButton>
      </footer>
    </>
  );
};

export default Auth;