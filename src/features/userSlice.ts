import { createSlice} from "@reduxjs/toolkit";
// NOTE >> storeに保存されているstateの型をインポートする。
import type { RootState } from "../app/store";
export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      uid: "",
      username: "",
      userIcon: "",
      prefecture: "",
      job: "",
      introduction: "",
    },
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = {
        uid: "",
        username: "",
        userIcon: "",
        prefecture: "",
        job: "",
        introduction: "",
      };
    },
    update: (state, action) => {
      state.user = action.payload;
    }
  },
});

// NOTE >> stateとactionsは他のコンポーネントで呼び出すためにエクスポートしている。
export const selectUser = (state: RootState) => state.user.user;
export const { login, logout, update } = userSlice.actions;

// NOTE >> reducerはstoreでconfigureStoreするために必要なのでエクスポートしている。
export default userSlice.reducer;
