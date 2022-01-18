/* eslint-disable import/no-cycle */
import { RootState } from "@redux-store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { validTitle } from "../Post";

type TitleSlice = string;
const initialState: TitleSlice = "";
export const titleSlice = createSlice({
  name: "postTitle",
  initialState,

  reducers: {
    // Right now this just adds the title, but we probably want
    // profanity validation etc.
    addTitle: (state, action: PayloadAction<string>) => action.payload
  }
});

// Export actions
export const { addTitle } = titleSlice.actions;

// Export selectors
export const selectTitle = (state: RootState) => state.createPost.title;
export const selectIsTitleValid = (state: RootState) =>
  validTitle(state.createPost.title);
// Export the reducer
export default titleSlice.reducer;
