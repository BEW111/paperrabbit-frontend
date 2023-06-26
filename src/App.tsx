import React, { useState } from "react";

import SearchBar from "./SearchBar";
import RabbitGraph from "./RabbitGraph";

import logo from "./logo.png";
import PaperPopup from "./PaperPopup";
import ImprovedGraph from "./ImprovedGraph";

const data = {
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
  const [paperPopup, setPaperPopup] = useState({});

  return (
    <div className="h-screen w-full bg-amber-100">
      <div className="absolute h-full w-full">
        <ImprovedGraph graphData={graphData} setPaperPopup={setPaperPopup} />
      </div>
      <div className="pointer-events-none absolute flex h-full w-full flex-col items-center justify-center">
        <SearchBar setGraphData={setGraphData} />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 z-10 flex h-full w-1/3 items-center justify-center p-6">
        {paperPopup?.id && (
          <PaperPopup
            paperPopupInfo={paperPopup}
            closePaperPopup={() => setPaperPopup({})}
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
