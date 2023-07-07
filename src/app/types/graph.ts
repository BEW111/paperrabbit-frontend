// The way the graph data will be stored in the app,
// which is the same exact form as the data used for Vis

// The types received directly from the api
export type ApiNode = {
  id: string;
  title: string;
  summary: string;
  authors: string[];
};

export type ApiEdge = [string, string, string];

// The types we will store the graph as in our app
export type GraphNode = {
  id: string;
  label: string;
};

export type GraphEdge = {
  from: string;
  to: string;
  label: string;
  arrows: string;
};

export type GraphData = {
  nodes: Array<GraphNode>;
  edges: Array<GraphEdge>;
};
