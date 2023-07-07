import React, { useState } from "react";

import SearchBar from "./components/SearchBar";

import logo from "../logo.png";
import PaperPopup from "./components/PaperPopup";
import RabbitGraph from "./components/RabbitGraph";
import { useAppSelector } from "./redux/hooks";
import { selectIsPopupOpen } from "./redux/popupSlice";

const App = () => {
  const popupOpen = useAppSelector(selectIsPopupOpen);

  return (
    <div className="h-screen w-full bg-amber-100 font-sans">
      <div className="absolute h-full w-full cursor-move">
        <RabbitGraph />
      </div>
      <div className="pointer-events-none absolute flex h-full w-full flex-col items-center justify-center">
        <SearchBar />
      </div>
      <div className="pointer-events-none absolute right-0 top-0 z-10 flex h-full w-1/3 items-center justify-center p-6">
        {popupOpen && <PaperPopup />}
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
