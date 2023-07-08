import { Descendant } from "slate";

// The form of any quiz
export type Quiz = {
  question: string;
  options: string[];
  answer: string;
};

// The current type of popup we have
export type PopupMode = "quiz" | "notes" | "journey" | null;

// Data on some paper we have
export type PaperData = {
  notes?: Descendant[];
  quiz?: Quiz;
  completed: boolean;
};
