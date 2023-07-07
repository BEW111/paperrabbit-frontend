// Keeps track of all info related to specific papers, including
// user notes, quizzes, quiz results, and if the papers have been marked as completed

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GraphData } from "../types/graph";

const initialState: GraphData = {
  nodes: [],
  edges: [],
};

export const graphSlice = createSlice({
  name: "graph",
  initialState: initialState,
  reducers: {},
});

export const {} = graphSlice.actions;
// export const selectAllPapers = (state) => state;
// export const selectPaperById = (id: string) => (state) => state[id];

export default graphSlice.reducer;
