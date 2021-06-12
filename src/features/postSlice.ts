import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface PostState {
  imageUrl: string;
  caption: string;
  preview: boolean;
}

const noImage = `${process.env.PUBLIC_URL}/noPhoto.png`;
const initialState: PostState = {
  imageUrl: noImage,
  caption: "",
  preview: false,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    HandleImageUrl: (state, action: PayloadAction<string>) => {
      state.imageUrl = action.payload;
    },
    ClearImageUrl: (state) => {
      state.imageUrl = noImage;
    },
    HandleCaption: (state, action: PayloadAction<string>) => {
      state.caption = action.payload;
    },
    ClearCaption: (state) => {
      state.caption = "";
    },
    TogglePreview: (state) => {
      state.preview = !state.preview;
    },
  },
});

export const {
  HandleImageUrl,
  ClearImageUrl,
  HandleCaption,
  ClearCaption,
  TogglePreview,
} = postSlice.actions;
export const selectImageUrl = (state: RootState) => state.post.imageUrl;
export const selectCaption = (state: RootState) => state.post.caption;
export const selectPreview = (state: RootState) => state.post.preview;
export default postSlice.reducer;
