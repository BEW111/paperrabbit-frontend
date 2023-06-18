import React, { useState, useEffect, useCallback, useMemo } from "react";

import { BiX } from "react-icons/bi";
import MarkdownPreviewExample from "./MarkdownEditor";

import { fetchArxivTitle } from "./utils";

const PaperPopup = ({ closePaperPopup, articleId }) => {
  const [currentTitle, setCurrentTitle] = useState(articleId);

  const updateTitle = useCallback(async () => {
    const title = await fetchArxivTitle(articleId);
    setCurrentTitle(title);
  }, []);

  useEffect(() => {
    console.log("test");
    updateTitle().catch(console.error);
  }, [updateTitle]);

  return (
    <div className="pointer-events-auto h-full flex-1 flex-col rounded-lg border-2 border-black bg-slate-300">
      <div className="flex w-full justify-between border-b border-b-black p-4">
        <h2 className="pl-2">My notes on {currentTitle}</h2>
        <BiX className="cursor-pointer" size={24} onClick={closePaperPopup} />
      </div>
      <div className="pointer-events-auto p-4">
        <MarkdownPreviewExample />
      </div>
    </div>
  );
};

export default PaperPopup;
