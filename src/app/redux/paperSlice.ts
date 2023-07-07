// Keeps track of all info related to specific papers, including
// user notes, quizzes, quiz results, and if the papers have been marked as completed

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Quiz } from "../components/PaperPopup";

type PaperData = {
  notes: string;
  quiz: Quiz;
  completed: boolean;
};

type PaperDictionary = {
  [paperId: string]: PaperData;
};

const initialState: PaperDictionary = {};

export const paperSlice = createSlice({
  name: "paper",
  initialState: initialState,
  reducers: {
    addPaper: (
      state,
      action: PayloadAction<{ id: string; paperData: PaperData }>
    ) => {
      state.value = {
        ...state.value,
        [action.payload.id]: action.payload.paperData,
      };
    },
    updatePaperNotes: (
      state,
      action: PayloadAction<{ id: string; updatedNotes: string }>
    ) => {
      state.value[action.payload.id] = {
        ...state.value[action.payload.id],
        notes: action.payload.updatedNotes,
      };
    },
    markAsCompleted: (state, action: PayloadAction<{ id: string }>) => {
      state.value[action.payload.id] = {
        ...state.value[action.payload.id],
        completed: true,
      };
    },
    markAsUncompleted: (state, action: PayloadAction<{ id: string }>) => {
      state.value[action.payload.id] = {
        ...state.value[action.payload.id],
        completed: false,
      };
    },
  },
});

export const {
  addPaper,
  updatePaperNotes,
  markAsCompleted,
  markAsUncompleted,
} = paperSlice.actions;
export const selectAllPapers = (state) => state.paper;
export const selectPaperById = (id: string) => (state) => state.paper[id];

export default paperSlice.reducer;
