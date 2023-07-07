// Keeps track of the current graph

// We don't worry about the stored graph being a valid graph, since we will
// check this when we actually render the graph

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GraphData } from "../types/graph";
import { GraphNode, GraphEdge } from "../types/graph";

const initialState: GraphData = {
  nodes: [],
  edges: [],
};

export const graphSlice = createSlice({
  name: "graph",
  initialState: initialState,
  reducers: {
    addNode: (state, action: PayloadAction<GraphNode>) => {
      state.nodes.push(action.payload);
    },
    addEdge: (state, action: PayloadAction<GraphEdge>) => {
      state.edges.push(action.payload);
    },
    clearGraph: (state) => {
      state.nodes = [];
      state.edges = [];
    },
  },
});

export const { addNode, addEdge, clearGraph } = graphSlice.actions;
export const selectGraphData = (state) => state.graph;

export default graphSlice.reducer;
