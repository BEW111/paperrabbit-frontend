// Keeps track of the current popup

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PopupMode, Quiz } from "../types/popup";
import { RootState } from "./store";

type PopupState = {
  isOpen: boolean;
  paperId?: string;
  paperLabel?: string;
  mode: PopupMode;
};

const initialState: PopupState = {
  isOpen: false,
  mode: null,
};

export const popupSlice = createSlice({
  name: "popup",
  initialState: initialState,
  reducers: {
    openOrUpdatePopup: (
      state,
      action: PayloadAction<{ id: string; label: string; mode: PopupMode }>
    ) => {
      state.isOpen = true;
      state.paperId = action.payload.id;
      state.paperLabel = action.payload.label;
      state.mode = action.payload.mode;
    },
    closePopup: (state) => {
      state.isOpen = false;
      state.mode = null;
      state.paperId = null;
      state.paperLabel = null;
    },
    setPopupMode: (state, action: PayloadAction<PopupMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { closePopup, openOrUpdatePopup, setPopupMode } =
  popupSlice.actions;
export const selectIsPopupOpen = (state: RootState) => state.popup.isOpen;
export const selectPopupId = (state: RootState) => state.popup.paperId;
export const selectPopupLabel = (state: RootState) => state.popup.paperLabel;
export const selectPopupMode = (state: RootState) => state.popup.mode;

export default popupSlice.reducer;
