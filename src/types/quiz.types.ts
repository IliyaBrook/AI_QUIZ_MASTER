export interface AnswerOption {
  text: string;
  rationale: string;
  is_correct: boolean;
}

export interface Question {
  question: string;
  answer_options: AnswerOption[];
}

export interface QuizData {
  title: string;
  questions: Question[];
}

export interface ImmersiveQuizFormat {
  quiz: QuizData;
}
