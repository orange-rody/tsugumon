import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, login, logout } from "./features/userSlice";
import { auth, db } from "./firebase";
import MainView from "./components/MainView";
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
              username: userData.username,
              userIcon: userData.userIcon,
              prefecture: userData.prefecture,
              job: userData.job,
              introduction: userData.introduction,
            })
          );
        });
        console.log(auth.currentUser);
      } else {
        dispatch(logout());
      }
    });
    return () => {
      unSubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div style={style}>{user.uid ? <MainView /> : <Auth />}</div>
    </>
  );
};

export default App;
