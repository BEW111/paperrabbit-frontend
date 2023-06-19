import React, { useState, useEffect, useCallback, useMemo } from "react";

import { BiX } from "react-icons/bi";
import MarkdownPreviewExample from "./MarkdownEditor";

const QuizComponent = () => {
  const quizData = {
    answer: "B. Energy density",
    options: [
      "A. Constitutive parameters",
      "B. Energy density",
      "C. Momentum density",
      "D. Energy flux",
    ],
    question: "What is the Energy Momentum Tensor related to?",
  };

  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedOption === quizData.answer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="p-2 pl-3">
      <h2>{quizData.question}</h2>
      <form onSubmit={handleSubmit}>
        {quizData.options.map((option, index) => (
          <div key={index}>
            <input
              type="radio"
              id={`option-${index}`}
              name="quiz-option"
              value={option}
              onChange={() => setSelectedOption(option)}
              checked={selectedOption === option}
            />
            <label className="ml-2" htmlFor={`option-${index}`}>
              {option}
            </label>
          </div>
        ))}
        <button
          type="submit"
          className="mt-2 rounded-md border-black bg-slate-400 p-1 px-2"
        >
          <b>Submit</b>
        </button>
      </form>
      {isCorrect !== null && (
        <h3>{isCorrect ? "Correct!" : "Incorrect, try again."}</h3>
      )}
    </div>
  );
};

const PaperPopup = ({ closePaperPopup, paperPopupInfo }) => {
  return (
    <div className="space-between pointer-events-auto flex h-full flex-1 flex-col rounded-lg border-2 border-black bg-slate-300">
      <div className="flex w-full flex-none justify-between border-b border-b-black p-4">
        <h2 className="pl-2">My notes on {paperPopupInfo.label}</h2>
        <BiX className="cursor-pointer" size={24} onClick={closePaperPopup} />
      </div>
      <div className="pointer-events-auto flex-auto p-4">
        <MarkdownPreviewExample />
      </div>
      <div className="bg-red m-4 h-1/3 rounded-md border-2 border-black">
        <QuizComponent />
      </div>
    </div>
  );
};

export default PaperPopup;
