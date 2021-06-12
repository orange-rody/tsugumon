import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    image:{image: "",imageUrl:`${process.env.PUBLIC_URL}/noPhoto.png`},caption: "",
    preview: false,
  },
  reducers: {
    HandleImage:(state, action) => {
      state.image = action.payload;
    },
    ClearImage:(state) => {
      state.image = {image:"",imageUrl:`${process.env.PUBLIC_URL}/noPhoto.png`};
    },
    HandleCaption:(state,action) => {
      state.caption = action.payload;
    },
    ClearCaption:(state) => {
      state.caption = "";
    },
    TogglePreview:(state)=>{
      state.preview = !state.preview;
    }
  }
});

export const {HandleImage, ClearImage,HandleCaption,ClearCaption,TogglePreview} = postSlice.actions;
export const selectImage = (state: RootState) => state.post.image;
export const selectCaption = (state: RootState) => state.post.caption;
export const selectPreview = (state: RootState) => state.post.preview;
export default postSlice.reducer;