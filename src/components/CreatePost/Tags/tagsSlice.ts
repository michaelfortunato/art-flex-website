// eslint-disable-next-line import/no-cycle
import { RootState } from "@redux-store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isTag, Tag as TagProps } from "../Post";

const initialState: TagProps[] = [];

export const tagsSlice = createSlice({
  name: "postTags",
  initialState,
  reducers: {
    upsertTag: (state, action: PayloadAction<{ tag: TagProps }>) => {
      const { tag } = action.payload;
      if (!state.some(currentTags => currentTags.label === tag.label)) {
        state.push(tag);
      }
    },
    removeTag: (state, action: PayloadAction<{ tag: TagProps }>) => {
      const { tag } = action.payload;
      const filteredTags = state.filter(
        stateTag => stateTag.label !== tag.label
      );
      return {
        ...state,
        tags: filteredTags
      };
    },
    setTags: (state, action: PayloadAction<{ tags: TagProps[] }>) => {
      const { tags } = action.payload;
      return tags;
    }
  }
});

// Export actions
export const { upsertTag, removeTag, setTags } = tagsSlice.actions;

// Export selectors
export const selectTags = (state: RootState) => state.createPost.tags;
export const selectAreTagsValid = (state: RootState) =>
  state.createPost.tags.length > 0 &&
  state.createPost.tags.every(tag => isTag(tag));
// Export the reducer
export default tagsSlice.reducer;
