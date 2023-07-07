// The form of any quiz
export type Quiz = {
  question: string;
  options: string[];
  answer: string;
};

// The current type of popup we have
export type PopupMode = "quiz" | "notes" | "journey" | null;
