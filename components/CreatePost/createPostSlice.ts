import { combineReducers } from "@reduxjs/toolkit";
import titleReducer from "./Title/titleSlice";
import descriptionReducer from "./Description/descriptionSlice";
import tagsReducer from "./Tags/tagsSlice";
import imagesReducer from "./Images/imagesSlice";
// eslint-disable-next-line import/no-cycle
import pricingReducer from "./Pricing/pricingSlice";
import { RootState } from "@redux-store/store";

export default combineReducers({
  title: titleReducer,
  description: descriptionReducer,
  tags: tagsReducer,
  inputImages: imagesReducer,
  pricing: pricingReducer
});

export const selectCreatePost = (state: RootState) => state.createPost;
