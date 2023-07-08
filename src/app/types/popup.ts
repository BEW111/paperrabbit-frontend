import { Descendant } from "slate";

// The form of any quiz
// We expect the strings for "options" to be of the form
// "A. something here..."
// "B. something else here..."
// And we expect answer to be one of options
export type Quiz = {
  question: string;
  options: string[];
  answer: string;
};

export const isQuiz = (data: any): data is Quiz => {
  const validOption = new RegExp(/^[A-Z]\. .+$/);

  return (
    data &&
    // Check question
    typeof data.question === "string" &&
    // Check options
    Array.isArray(data.options) &&
    data.options.every(
      (q: any) => typeof q === "string" && validOption.test(q)
    ) &&
    // Check answer
    typeof data.answer === "string" &&
    data.options.includes(data.answer)
  );
};

// The current type of popup we have
export type PopupMode = "quiz" | "notes" | "journey" | null;

// Data on some paper we have
export type PaperData = {
  notes?: Descendant[];
  quiz?: Quiz;
  completed: boolean;
};
