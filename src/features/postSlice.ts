import { createSlice } from "@reduxjs/toolkit";
import type {RootState} from "../app/store";
export const postSlice = createSlice({
  name: "post",
  initialState: {
    post: [
      {
        id: "",
        caption: "",
        imageUrl: "",
        timestamp: "",
        userName: "",
      },
    ],
  },
  reducers: {
    load: (state, action) => {
      state.post = action.payload;
    },
    additionalLoad: (state, action) => {
      state.post.push(...action.payload);
    }
  },
});

export const selectPost = (state:RootState) => state.post.post;
export const {load,additionalLoad} = postSlice.actions;
export default postSlice.reducer;