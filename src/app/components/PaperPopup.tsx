import React, { useState, useEffect, useCallback, useMemo } from "react";

import { BiX, BiArrowBack } from "react-icons/bi";
import MarkdownPreview from "./MarkdownEditor";

import { getQuizData } from "../utils";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  updatePaperNotes,
  markAsCompleted,
  markAsUncompleted,
  selectPaperById,
} from "../redux/paperSlice";
import { Quiz } from "../types/popup";
import {
  closePopup,
  setPopupMode,
  selectPopupLabel,
  selectPopupMode,
  selectPopupId,
} from "../redux/popupSlice";

export const defaultPopupState = {
  id: "",
  label: "",
  mode: null,
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

const NotesComponent = ({ currentPaperId }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-grow">
        <MarkdownPreview paperId={currentPaperId} key={currentPaperId} />
      </div>
      <div
        className="m-4 flex-none cursor-pointer rounded-lg bg-blue-900 p-2 text-center text-2xl text-white"
        onClick={() => dispatch(setPopupMode("quiz"))}
      >
        Take Quiz
      </div>
    </div>
  );
};

const PaperPopup = () => {
  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const popupMode = useAppSelector(selectPopupMode);
  const currentPaperLabel = useAppSelector(selectPopupLabel);
  const currentPaperId = useAppSelector(selectPopupId);

  const dispatch = useAppDispatch();

  useEffect(() => {
    let isSubscribed = true;

    const refreshQuizData = async () => {
      const data = await getQuizData();

      if (isSubscribed) {
        setQuizData(data);
      }
    };

    refreshQuizData().catch(console.error);

    return () => {
      isSubscribed = false;
    };
  }, []);

  const disableQuiz = () => {
    dispatch(setPopupMode("notes"));
  };

  return (
    <div className="space-between pointer-events-auto flex h-full flex-1 flex-col rounded-lg border-2 border-black bg-slate-300">
      <div className="align-center flex w-full flex-none justify-center border-b border-b-black p-4">
        {popupMode == "quiz" && (
          <BiArrowBack
            className="absolute left-10 cursor-pointer"
            size={24}
            onClick={disableQuiz}
          />
        )}
        <h2 className="px-6 text-center">
          <a
            className="text-center hover:underline"
            href={`https://arxiv.org/abs/${currentPaperId}`}
            target="_blank"
          >
            {currentPaperLabel}
          </a>
        </h2>
        <BiX
          className="absolute right-10 cursor-pointer"
          size={24}
          onClick={() => dispatch(closePopup())}
        />
      </div>
      <div className="pointer-events-auto flex-auto p-4">
        {popupMode == "notes" ? (
          <NotesComponent currentPaperId={currentPaperId} />
        ) : (
          quizData && (
            <QuizComponent
              question={quizData.question}
              options={quizData.options}
              answer={quizData.answer}
            />
          )
        )}
      </div>
    </div>
  );
};

export default PaperPopup;
