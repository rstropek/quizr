"use client";

import { Quiz } from "../quiz/page";
import { useState } from "react";
import { useRouter } from "next/navigation";

type PageProps = {
  questions: Quiz[];
};

type Answers = {
  city: string;
  answers: {
    questionId: string;
    answer: string;
  }[];
};

export default function Question({questions}: any) {
  const router = useRouter();

  let data: PageProps = { questions: questions! };
  // if (typeof props === "string") {
  //   data = JSON.parse(props);
  // } else {
  //   data = props;
  // }

  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(data.questions[0]);
  const [answers, setAnswers] = useState<
    {
      questionId: string;
      answer: string;
    }[]
  >([]);

  async function click1() {
    await click(currentQuestion.answer1);
  }

  async function click2() {
    await click(currentQuestion.answer2);
  }

  async function click3() {
    await click(currentQuestion.answer3);
  }

  async function click4() {
    await click(currentQuestion.answer4);
  }

  async function click(answer: string) {
    const collectedAnswers = [
      ...answers,
      { questionId: data.questions[currentQuestionId].id!, answer },
    ];
    setAnswers(collectedAnswers);
    if (currentQuestionId < data.questions.length - 1) {
      const nextQuestion = currentQuestionId + 1;
      setCurrentQuestionId(nextQuestion);
      setCurrentQuestion(data.questions[nextQuestion]);
    } else {
      const response = await fetch("/api/evaluateQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city: currentQuestion.city,
          answers: collectedAnswers,
        }),
      });
      const newLocation: string = await response.json();
      router.push(`/result/${newLocation!}`);
    }
  }

  return (
    <>
      <h2>{currentQuestion.city}</h2>

      <p>{currentQuestion.question}</p>

      <ul>
        <li onClick={click1}>{currentQuestion.answer1}</li>
        <li onClick={click2}>{currentQuestion.answer2}</li>
        <li onClick={click3}>{currentQuestion.answer3}</li>
        <li onClick={click4}>{currentQuestion.answer4}</li>
      </ul>
    </>
  );
}
