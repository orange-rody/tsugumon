import React, { useEffect } from "react";
import styles from "./App.module.css";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth } from "./firebase";
import Feed from "./components/Feed";
import Auth from "./components/Auth/Auth";

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    // useEffectではAppコンポーネントがアンマウントされたときに実行する処理を指定することができる。
    // 「Appコンポーネントがアンマウントされたときに実行する処理」のことをクリーンアップ関数という。
    // クリーンアップ関数はreturn構文を使って指定することができる。
    // ここでunSubscribeが再び呼び出されているのは、authUserがfalseになることを見越して、
    // dispatch(logout())が実行するためなのか？
    return () => {
      unSubscribe();
    };
  }, [dispatch]);

  return (
    <>
      {user.uid ? (
        <div className={styles.app}>
          <Feed />
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default App;
