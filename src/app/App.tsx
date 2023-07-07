import React, { useState } from "react";

import SearchBar from "./components/SearchBar";

import logo from "../logo.png";
import PaperPopup, {
  PopupInfo,
  defaultPopupState,
} from "./components/PaperPopup";
import RabbitGraph from "./components/RabbitGraph";

const App = () => {
  const [paperPopup, setPaperPopup] = useState<PopupInfo>(defaultPopupState);

  return (
    <div className="h-screen w-full bg-amber-100 font-sans">
      <div className="absolute h-full w-full cursor-move">
        <RabbitGraph setPaperPopup={setPaperPopup} />
      </div>
      <div className="pointer-events-none absolute flex h-full w-full flex-col items-center justify-center">
        <SearchBar setPaperPopup={setPaperPopup} />
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
