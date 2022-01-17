import { RootState } from "@redux-store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TagsState = {
  tags: string[];
  error: string | undefined;
};
const initialState: TagsState = {
  tags: [],
  error: undefined
};

export const tagsSlice = createSlice({
  name: "postTags",
  initialState,
  reducers: {
    upsertTag: (state, action: PayloadAction<{ tag: string }>) => {
      const { tag } = action.payload;
      if (!state.tags.includes(tag)) {
        state.tags.push(tag);
      }
    },
    removeTag: (state, action: PayloadAction<{ tag: string }>) => {
      const { tag } = action.payload;
      const filteredTags = state.tags.filter(stateTag => stateTag !== tag);
      return {
        ...state,
        tags: filteredTags
      };
    },
    setTags: (state, action: PayloadAction<{ tags: string[] }>) => {
      const { tags } = action.payload;
      return {
        tags,
        error: undefined
      };
    }
  }
});

// Export actions
export const { upsertTag, removeTag, setTags } = tagsSlice.actions;

// Export selectors
export const selectTags = (state: RootState) => state.createPost.tags;

// Export the reducer
export default tagsSlice.reducer;
