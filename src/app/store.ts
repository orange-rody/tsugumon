import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
// NOTE >> configureStoreで各レデューサーを結合するためインポートしている。
import userReducer from "../features/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
