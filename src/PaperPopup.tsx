import React, { useState, useEffect, useCallback, useMemo } from "react";

import { BiX } from "react-icons/bi";
import MarkdownPreviewExample from "./MarkdownEditor";

type Quiz = {
  question: string;
  options: string[];
  answer: string;
};

type PopupType = "quiz" | "notes" | "journey";

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

const QuizComponentItem = ({
  question,
  onSelect,
  currentSelected,
  correctMark,
}) => {
  const isSelected = currentSelected == question;

  return (
    <div
      className={`group rounded-lg border-2 p-2 hover:cursor-pointer hover:border-blue-500 ${
        isSelected && "border-slate-800 bg-slate-100"
      }`}
      onClick={() => onSelect(question)}
    >
      {correctMark == "correct" ? (
        <b className="mb-2 inline-block text-sm text-green-600">Correct</b>
      ) : (
        correctMark == "incorrect" && (
          <b className="mb-2 inline-block text-sm text-red-600">Incorrect</b>
        )
      )}
      <div className="flex flex-row items-center">
        <div
          className={`bg-red mr-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-500 text-gray-500 group-hover:border-blue-500 group-hover:text-blue-500 ${
            isSelected && "border-slate-800 text-slate-800"
          }`}
        >
          <p className="pointer-events-none">
            <b>{question.slice(0, 1)}</b>
          </p>
        </div>
        <p>{question.slice(3)}</p>
      </div>
    </div>
  );
};

const QuizComponent = ({ question, options, answer }: Quiz) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const onSelectItem = (question) => {
    setSelectedOption(question);
    setIsCorrect(null);
  };

  const handleSubmit = () => {
    // User wants to go to the next question or finish the quiz
    if (isCorrect) {
      console.log("Finished quiz!");
    } else {
      if (selectedOption === answer) {
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-none">
        <h1 className="mb-2 text-center text-3xl">Quiz 1</h1>
      </div>
      <div className="flex flex-auto flex-col p-2 pl-3">
        <h2 className="mb-6">
          <b>{question}</b>
        </h2>
        <div className="flex flex-col gap-4">
          {options.map((option) => (
            <QuizComponentItem
              onSelect={onSelectItem}
              question={option}
              currentSelected={selectedOption}
              correctMark={
                option == selectedOption
                  ? isCorrect != null &&
                    (option == answer ? "correct" : "incorrect")
                  : "default"
              }
            />
          ))}
        </div>
        <div className="mt-auto text-right">
          <div
            onClick={handleSubmit}
            className="inline-block rounded-lg border-2 border-slate-500 bg-slate-500 px-4 py-2 text-white hover:cursor-pointer hover:border-white hover:bg-slate-400"
          >
            {isCorrect ? "Next question" : "Submit"}
          </div>
        </div>
      </div>
    </div>
  );
};

const PaperPopup = ({ closePaperPopup, paperPopupInfo }) => {
  const mode: PopupType = "quiz";

  return (
    <div className="space-between pointer-events-auto flex h-full flex-1 flex-col rounded-lg border-2 border-black bg-slate-300">
      <div className="flex w-full flex-none justify-between border-b border-b-black p-4">
        <h2 className="pl-2">My notes on {paperPopupInfo.label}</h2>
        <BiX className="cursor-pointer" size={24} onClick={closePaperPopup} />
      </div>
      <div className="pointer-events-auto flex-auto p-4">
        {/* <MarkdownPreviewExample /> */}
        <QuizComponent
          question={quizData.question}
          options={quizData.options}
          answer={quizData.answer}
        />
      </div>
    </div>
  );
};

export default PaperPopup;
