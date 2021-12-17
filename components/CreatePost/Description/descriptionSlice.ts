import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { validDescription } from "../Post";

type DescriptionState = {
  description: string | undefined;
  error: undefined | string;
};
const initialState: DescriptionState = {
  description: undefined,
  error: undefined
};
export const descriptionSlice = createSlice({
  name: "postDescription",
  initialState,
  reducers: {
    // Right now this just adds the title, but we probably want
    // profanity validation etc.
    addDescription: (state, action: PayloadAction<{ description: string }>) => {
      const { description } = action.payload;
      const { error } = validDescription(description);
      return {
        description: !error ? description : state.description,
        error
      };
    }
  }
});

// Export actions
export const { addDescription } = descriptionSlice.actions;

// Export selectors
export const selectDescripton = (state: DescriptionState) => state.description;
export const selectDescriptonError = (state: DescriptionState) => state.error;

// Export the reducer
export default descriptionSlice.reducer;
