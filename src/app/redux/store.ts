import { configureStore } from "@reduxjs/toolkit";
import graphReducer from "./graphSlice";
import paperReducer from "./paperSlice";
import popupReducer from "./popupSlice";

const store = configureStore({
  reducer: {
    graph: graphReducer,
    paper: paperReducer,
    popup: popupReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
