import {createSlice} from "@reduxjs/toolkit";
import { maxHeaderSize } from "http";
import type {RootState} from "../app/store";
export const companySlice = createSlice({
  name: "company",
  initialState: {
    company: {
      companyId: "",
      companyName: "",
      companyIcon: "",
      companyVisual: "",
      introduction: "",
      owner: "",
      jobType: "",
      address: "",
    },
  },
reducers:{
  
},
});
