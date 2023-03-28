import { configureStore } from "@reduxjs/toolkit";
import { ThunkDispatch } from "redux-thunk";
import * as slice from "./slices";

export const createStore = () =>
  configureStore({
    reducer: {
      account: slice.accountSlice,
      ui: slice.uiSlice,
      workout: slice.workoutSlice,
      data: slice.dataSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });

export const store = createStore();

export type AppThunkDispatch = ThunkDispatch<RootState, any, any>;

// Selectors
export const selectAccount = (state: RootState) => state.account;
export const selectUi = (state: RootState) => state.ui;
export const selectWorkout = (state: RootState) => state.workout;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
