import { configureStore } from "@reduxjs/toolkit";
import graphReducer from "./graphSlice";
import paperReducer from "./paperSlice";

const store = configureStore({
  reducer: {
    graph: graphReducer,
    paper: paperReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
