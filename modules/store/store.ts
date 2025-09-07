import { configureStore } from "@reduxjs/toolkit";
import postReducer from "../post/services/PostSlice";

export const store = configureStore({
  reducer: {
    posts: postReducer,
  },
});

// Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
