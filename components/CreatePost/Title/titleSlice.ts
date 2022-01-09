/* eslint-disable import/no-cycle */
import { RootState } from "@redux-store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TitleSlice = { title: string | undefined };
const initialState: TitleSlice = {
  title: undefined
};
export const titleSlice = createSlice({
  name: "postImages",
  initialState,

  reducers: {
    // Right now this just adds the title, but we probably want
    // profanity validation etc.
    addTitle: (state, action: PayloadAction<{ title: string }>) =>
      action.payload
  }
});

// Export actions
export const { addTitle } = titleSlice.actions;

// Export selectors
export const selectTitle = (state: RootState) => state.createPost.title;

// Export the reducer
export default titleSlice.reducer;
