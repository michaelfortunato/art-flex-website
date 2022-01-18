/* eslint-disable import/no-cycle */
import { RootState } from "@redux-store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { validDescription } from "../Post";

const initialState: string = "";

export const descriptionSlice = createSlice({
  name: "postDescription",
  initialState,
  reducers: {
    // Right now this just adds the title, but we probably want
    // profanity validation etc.
    addDescription: (state, action: PayloadAction<string>) => action.payload
  }
});

// Export actions
export const { addDescription } = descriptionSlice.actions;

// Export selectors
export const selectDescripton = (state: RootState) =>
  state.createPost.description;
export const selectIsDescriptionValid = (state: RootState) =>
  validDescription(state.createPost.description);
// Export the reducer
export default descriptionSlice.reducer;
