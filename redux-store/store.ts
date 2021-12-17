import { configureStore, combineReducers } from "@reduxjs/toolkit";
import createPostReducer from "@components/CreatePost/createPostSlice";

export default configureStore({
  reducer: combineReducers({
    createPost: createPostReducer
  })
});
