'use client';

import { Quiz } from "../quiz/page";
import { useState } from 'react';

type Props = {
    questions: Quiz[];
}

type Answers = {
  city: string;
  answers: {
    questionId: string;
    answer: string;
  }[];
};

export default function Question(data: Props) {
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(data.questions[0]);
  const [answers, setAnswers] = useState<{
    questionId: string;
    answer: string;
  }[]>([]);

  function click(answer: string) {
    const collectedAnswers = [...answers, { questionId: data.questions[currentQuestionId].id!, answer }];
    setAnswers(collectedAnswers)
    console.log(collectedAnswers);
    if (currentQuestionId < data.questions.length - 1) {
      const nextQuestion = currentQuestionId + 1;
      setCurrentQuestionId(nextQuestion);
      setCurrentQuestion(data.questions[nextQuestion]);
    }
  }

  return <>
    <h2>{ data.questions[currentQuestionId].city }</h2>

    <p>
      { data.questions[currentQuestionId].question }
    </p>

    <ul>
      <li onClick={ () => click(data.questions[currentQuestionId].answer1) }>{ data.questions[currentQuestionId].answer1 }</li>
      <li>{ data.questions[currentQuestionId].answer2 }</li>
      <li>{ data.questions[currentQuestionId].answer3 }</li>
      <li>{ data.questions[currentQuestionId].answer4 }</li>
    </ul>
  </>;
}

