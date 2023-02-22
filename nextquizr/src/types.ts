export type Quiz = {
  id?: string;
  city: string;
  question: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  correctAnswer: string;
  sync: boolean;
};

export type Answer = {
  questionId: string;
  answer: string;
};

export type Answers = {
  city: string;
  answers: Answer[];
};

export type Evaluation = {
  correctAnswers: number;
  city: string;
  correctPercentage: number;
};