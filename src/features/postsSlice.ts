import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
export const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [
      {
        id: "" as string,
        caption: "" as string,
        imageUrl: "" as string,
        timestamp: 0 as number,
        userName: "" as string,
      },
    ],
    oldestId: "" as string,
  },
  reducers: {
    edit: (state, action) => {
      state.posts = action.payload;
    },
    getOldestId: (state, action) => {
      state.oldestId = action.payload;
    },
  },
});

export const selectPosts = (state: RootState) => state.posts.posts;
export const selectOldestId = (state: RootState) => state.posts.oldestId;
export const { edit, getOldestId } = postsSlice.actions;

export default postsSlice.reducer;
