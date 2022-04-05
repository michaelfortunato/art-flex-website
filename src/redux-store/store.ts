import { configureStore, combineReducers } from "@reduxjs/toolkit";
// eslint-disable-next-line import/no-cycle
import createPostReducer from "@components/CreatePost/createPostSlice";

const store = configureStore({
  reducer: combineReducers({
    createPost: createPostReducer
  })
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
