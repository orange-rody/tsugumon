import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth, db } from "./firebase";
import Feed from "./components/Feed";
import Auth from "./components/Auth/Auth";

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const style = {
    width: "100vw",
    height: "100vh",
  };

  useEffect(() => {
    const unSubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //firestoreのusersコレクションの中からauthUser.uidに対応するドキュメントを参照する
        const userRef = db.collection("users").doc(authUser.uid);
        userRef.get().then((user) => {
          // userコレクションにアクセスするにはdata()メソッドを使用する
          // userDataがnullとならないよう、user.data()!といった形で型アサーションを使用する
          const userData = user.data()!;
          dispatch(
            login({
              uid: authUser.uid,
              userName: userData.userName,
              userIcon: userData.userIcon,
              profile: userData.profile,
            })
          );
        });
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
      <div style={style}>{user.uid ? <Feed /> : <Auth />}</div>
    </>
  );
};

export default App;
