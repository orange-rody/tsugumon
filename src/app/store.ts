import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
// NOTE >> configureStoreで各レデューサーを結合するためインポートしている。
import userReducer from "../features/userSlice";
import postsReducer from "../features/postsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    // post: postReducer,
    posts: postsReducer,
    oldestId: postsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
