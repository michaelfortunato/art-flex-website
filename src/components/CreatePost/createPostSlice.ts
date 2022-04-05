/* eslint-disable import/no-cycle */
import { combineReducers } from "@reduxjs/toolkit";
import { RootState } from "@redux-store/store";
import titleReducer from "./Title/titleSlice";
import descriptionReducer from "./Description/descriptionSlice";
import tagsReducer from "./Tags/tagsSlice";
import imagesReducer from "./Images/imagesSlice";
import pricingReducer from "./Pricing/pricingSlice";

export default combineReducers({
  title: titleReducer,
  description: descriptionReducer,
  tags: tagsReducer,
  inputImages: imagesReducer,
  pricing: pricingReducer
});

export const selectCreatePost = (state: RootState) => state.createPost;
