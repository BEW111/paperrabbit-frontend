import React, { useState } from "react";

import SearchBar from "./SearchBar";

import logo from "./logo.png";
import PaperPopup, { PopupInfo, defaultPopupState } from "./PaperPopup";
import RabbitGraph from "./RabbitGraph";
import _ from "lodash";

// temp to start

interface ApiNode {
  id: string;
  title: string;
  summary: string;
  authors: string[];
}

type ApiEdge = [string, string, string];

interface Node {
  id: string;
  label: string;
}

interface Edge {
  from: string;
  to: string;
  arrows: string;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

const data: GraphData = {
  nodes: [
    {
      id: "2106.09685",
      label: "LoRA",
    },
    {
      id: "2305.14314",
      label: "QLoRA",
    },
    {
      id: "2208.07339",
      label: "LLM.int8()",
    },
  ],
  edges: [
    {
      from: "2106.09685",
      to: "2305.14314",
      arrows: "to",
    },
    {
      from: "2208.07339",
      to: "2305.14314",
      arrows: "to",
    },
  ],
};

const App = () => {
  const [graphData, setGraphData] = useState(data);
  const addNode = (node: ApiNode, edge: ApiEdge) => {
    setGraphData((prevGraphData) => ({
      nodes: _.uniqBy([...prevGraphData.nodes, { id: node.id, label: node.title }], "id"),
      edges: _.uniqWith([...prevGraphData.edges, { from: edge[0], to: edge[2], arrows: "to" }], _.isEqual),
    }));
  };

  const clearGraph = () => {
    setGraphData({ nodes: [], edges: [] });
  }

  const [paperPopup, setPaperPopup] = useState<PopupInfo>(defaultPopupState);

  console.log(paperPopup);

  return (
    <div className="h-screen w-full bg-amber-100 font-sans">
      <div className="absolute h-full w-full cursor-move">
        <RabbitGraph graphData={graphData} setPaperPopup={setPaperPopup} />
      </div>
      <div className="pointer-events-none absolute flex h-full w-full flex-col items-center justify-center">
        <SearchBar addNode={addNode} clearGraph={clearGraph} setPaperPopup={setPaperPopup} />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 z-10 flex h-full w-1/3 items-center justify-center p-6">
        {paperPopup.mode != null && (
          <PaperPopup
            paperPopupInfo={paperPopup}
            setPaperPopup={setPaperPopup}
            closePaperPopup={() => setPaperPopup(defaultPopupState)}
          />
        )}
      </div>
      <img
        className="absolute left-4 top-4 rounded-xl"
        width={64}
        height={64}
        src={logo}
      />
    </div>
  );
};

export default App;
