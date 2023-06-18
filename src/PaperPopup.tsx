import React, { useState, useEffect, useCallback, useMemo } from "react";

import { BiX } from "react-icons/bi";
import MarkdownPreviewExample from "./MarkdownEditor";

const quiz_data = {
  answer: "B. Energy density",
  options: [
    "A. Constitutive parameters",
    "B. Energy density",
    "C. Momentum density",
    "D. Energy flux",
  ],
  question: "What is the Energy Momentum Tensor related to?",
};

const PaperPopup = ({ closePaperPopup, paperPopupInfo }) => {
  // const [currentTitle, setCurrentTitle] = useState(articleId);

  // const updateTitle = useCallback(async () => {
  //   const title = await fetchArxivTitle(articleId);
  //   setCurrentTitle(title);
  // }, []);

  // useEffect(() => {
  //   console.log("test");
  //   updateTitle().catch(console.error);
  // }, [updateTitle]);

  return (
    <div className="space-between pointer-events-auto flex h-full flex-1 flex-col rounded-lg border-2 border-black bg-slate-300">
      <div className="flex w-full flex-none justify-between border-b border-b-black p-4">
        <h2 className="pl-2">My notes on {paperPopupInfo.label}</h2>
        <BiX className="cursor-pointer" size={24} onClick={closePaperPopup} />
      </div>
      <div className="pointer-events-auto flex-auto p-4">
        <MarkdownPreviewExample />
      </div>
      {/* <div className="bg-red m-4 h-1/3 rounded-md border-2 border-black">
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
          Identification
        </h3>
        <ul className="w-48 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
          <li className="w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center pl-3">
              <input
                id="list-radio-license"
                type="radio"
                value=""
                name="list-radio"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
              />
              <label class="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Driver License{" "}
              </label>
            </div>
          </li>
          <li className="w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center pl-3">
              <input
                id="list-radio-id"
                type="radio"
                value=""
                name="list-radio"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
              />
              <label class="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                State ID
              </label>
            </div>
          </li>
          <li className="w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center pl-3">
              <input
                id="list-radio-millitary"
                type="radio"
                value=""
                name="list-radio"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
              />
              <label className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                US Millitary
              </label>
            </div>
          </li>
          <li className="w-full rounded-t-lg border-b border-gray-200 dark:border-gray-600">
            <div clclassNameass="flex items-center pl-3">
              <input
                id="list-radio-passport"
                type="radio"
                value=""
                name="list-radio"
                className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-700"
              />
              <label className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                US Passport
              </label>
            </div>
          </li>
        </ul>
      </div> */}
    </div>
  );
};

export default PaperPopup;
