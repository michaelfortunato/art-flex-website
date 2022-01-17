/* eslint-disable import/no-cycle */
import { RootState } from "@redux-store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MAX_IMAGES, PostImage } from "../Post";

type ImagesSlice = { images: PostImage[]; selectedImage: string | undefined };

// Use the image name as the id

export const imagesSlice = createSlice({
  name: "postImages",
  initialState: {
    images: [],
    selectedImage: undefined
  } as ImagesSlice,

  reducers: {
    addImage: (state, action: PayloadAction<PostImage>) => {
      const alreadyContainsImage = state.images.some(
        image => image.name === action.payload.name
      );
      if (!alreadyContainsImage) {
        return {
          ...state,
          images: [action.payload]
            .concat(state.images || [])
            .slice(0, MAX_IMAGES)
        };
      }
      return state;
    },
    // reorderImages chanages the order of images, returning the new array.
    // sourceIndex is the current position of the index wished to be rearranged
    // destinationIndex is the desired position of the image within the img arr
    // if source > dest => shift elements in [dest, source-1] one position down
    // if source < dest => shift elements in [source+1, dest] one position up;
    reorderImages: (
      state,
      action: PayloadAction<{
        sourceIndex: number;
        destinationIndex: number;
      }>
    ) => {
      const { sourceIndex, destinationIndex } = action.payload;
      if (sourceIndex === destinationIndex || !state.images) return state;
      if (sourceIndex < destinationIndex) {
        const topSlice = state.images.slice(0, sourceIndex);
        const middleSlice = state.images.slice(
          sourceIndex + 1,
          destinationIndex + 1
        );
        const bottomSlice = state.images.slice(destinationIndex + 1);
        return {
          ...state,
          images: topSlice.concat(
            middleSlice,
            [state.images[sourceIndex]],
            bottomSlice
          )
        };
      }
      const topSlice = state.images.slice(0, destinationIndex);
      const middleSlice = state.images.slice(destinationIndex, sourceIndex);
      const bottomSlice = state.images.slice(sourceIndex + 1);
      return {
        ...state,
        images: topSlice.concat(
          [state.images[sourceIndex]],
          middleSlice,
          bottomSlice
        )
      };
    },
    removeImage: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload;
      if (!state.images || index > state.images.length - 1) {
        console.log("here");
        return state;
      }
      console.log("there");
      const topSlice = state.images.slice(0, index);
      const bottomSlice = state.images.slice(index + 1);
      console.log(topSlice);
      console.log(bottomSlice);
      return {
        ...state,
        images: topSlice.concat(bottomSlice)
      };
    },
    setSelectedImage: (
      state,
      action: PayloadAction<{ selectedImage: string | undefined }>
    ) => {
      const { selectedImage } = action.payload;
      return {
        ...state,
        selectedImage
      };
    }
  }
});

// Export actions
export const { addImage, reorderImages, removeImage, setSelectedImage } =
  imagesSlice.actions;

// Export selectors
export const selectImage = (state: ImagesSlice, index: number) =>
  state.images?.[index];
export const selectImages = (state: RootState) => state.createPost.images;

export const getSelectedImageIndex = (state: RootState) => {
  const { selectedImage } = state.createPost.images;
  const { images } = state.createPost.images;
  if (selectedImage !== undefined) {
    return images.findIndex(image => image.name === selectedImage);
  }
  return undefined;
};
export default imagesSlice.reducer;
