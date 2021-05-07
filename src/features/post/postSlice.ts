import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface POST {
  editPhoto: string;
  editCaption: string;
}

export const postSlice = createSlice({
  name: "post",
  initialState: {
    post: { photoUrl: "", caption: "写真を登録してください" },
    user: "",
  },
  reducers: {
    newPost: (state, action: PayloadAction<POST>) => {
      state.post = {
        photoUrl: action.payload.editPhoto,
        caption: action.payload.editCaption,
      };
    },
  },
});

export const { newPost } = postSlice.actions;
export const selectPost = (state: any) => state.post.post;
export default postSlice.reducer;
