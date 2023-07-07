// The way the graph data will be stored in the app
// Different from the type for the graph used in Vis (we convert from this to Vis)

type GraphNode = {
  id: string;
  label: string;
};

type GraphEdge = {
  from: string;
  relation: string;
  to: string;
};

export type GraphData = {
  nodes: Array<GraphNode>;
  edges: Array<GraphEdge>;
};
