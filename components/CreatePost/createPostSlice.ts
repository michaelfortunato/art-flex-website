import { combineReducers } from "@reduxjs/toolkit";

import titleReducer from "./Title/titleSlice";
import descriptionReducer from "./Description/descriptionSlice";
import imagesReducer from "./Images/imagesSlice";
import pricingReducer from "./Pricing/pricingSlice";

export default combineReducers({
  title: titleReducer,
  description: descriptionReducer,
  images: imagesReducer,
  pricing: pricingReducer
});
