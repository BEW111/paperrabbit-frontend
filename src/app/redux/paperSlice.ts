// Keeps track of all info related to specific papers, including
// user notes, quizzes, quiz results, and if the papers have been marked as completed

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Descendant } from "slate";

import { Quiz, PaperData } from "../types/popup";
import { RootState } from "./store";

type PaperDictionaryState = {
  [paperId: string]: PaperData;
};

const initialState: PaperDictionaryState = {};

export const paperSlice = createSlice({
  name: "paper",
  initialState: initialState,
  reducers: {
    addPaper: (state, action: PayloadAction<string>) => {
      const initPaperData: PaperData = {
        notes: null,
        quiz: null,
        completed: false,
      };

      state[action.payload] = initPaperData;
    },
    updatePaperQuiz: (
      state,
      action: PayloadAction<{ id: string; quiz: Quiz }>
    ) => {
      state[action.payload.id].quiz = action.payload.quiz;
    },
    updatePaperNotes: (
      state,
      action: PayloadAction<{ id: string; notes: Descendant[] }>
    ) => {
      state[action.payload.id].notes = action.payload.notes;
    },
    markAsCompleted: (state, action: PayloadAction<string>) => {
      state[action.payload].completed = true;
    },
    markAsUncompleted: (state, action: PayloadAction<string>) => {
      state[action.payload].completed = false;
    },
  },
});

export const {
  addPaper,
  updatePaperNotes,
  updatePaperQuiz,
  markAsCompleted,
  markAsUncompleted,
} = paperSlice.actions;
export const selectAllPapers = (state: RootState) => state.paper;
export const selectPaperById = (id: string) => (state: RootState) =>
  state.paper[id];
export const selectPaperNotesById = (id: string) => (state: RootState) =>
  state.paper[id].notes;
export const selectPaperCompletedById = (id: string) => (state: RootState) =>
  state.paper[id].completed;
export const selectPaperQuizById = (id: string) => (state: RootState) =>
  state.paper[id].quiz;

export default paperSlice.reducer;
