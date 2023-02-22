"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Answer, Answers, Quiz } from "@/types";
import styles from "./page.module.css";

export default function Question({ questions }: any) {
  const router = useRouter();

  // Note that the type of the parameter cities is any because of a bug in the
  // current preview version of Next.js. Read more at https://github.com/vercel/next.js/issues/45088.
  // Therefore, we need to cast the parameter to the correct type.
  const questionArray: Quiz[] = questions;

  // We use the useState hook to keep track of the current question and
  // the answers that the user has given.
  const [currentQuestionId, setCurrentQuestionId] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(questionArray[0]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  // Helper functions for the onClick handlers.
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

  // The click handler for the answer options.
  async function click(answer: string) {
    // Add the answer to the list of answers.
    const collectedAnswers = [
      ...answers,
      { questionId: currentQuestion.id!, answer },
    ];
    setAnswers(collectedAnswers);

    if (currentQuestionId < questionArray.length - 1) {
      // There are more questions. Go to the next question.
      const nextQuestion = currentQuestionId + 1;
      setCurrentQuestionId(nextQuestion);
      setCurrentQuestion(questionArray[nextQuestion]);
    } else {
      // There are no more questions. Evaluate the quiz.
      // The evaluation is done in the backend because only
      // the backend has access to the correct answers.
      const answers: Answers = {
        city: currentQuestion.city,
        answers: collectedAnswers,
      };
      const response = await fetch("/api/evaluateQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
      });

      // The backend returns the encrypted result of the
      // evaluation. It is encrypted so that nobody can
      // manipulate it. In practice, signing would probably
      // be a better solution. Not done here to keep the
      // demo simple.
      const newLocation: string = await response.json();
      router.push(`/result/${newLocation!}`);
    }
  }

  return (
    <>
      <h1>{currentQuestion.city}</h1>

      <p>{currentQuestion.question}</p>

      <ul className={styles.answerOption}>
        <li onClick={click1}>{currentQuestion.answer1}</li>
        <li onClick={click2}>{currentQuestion.answer2}</li>
        <li onClick={click3}>{currentQuestion.answer3}</li>
        <li onClick={click4}>{currentQuestion.answer4}</li>
      </ul>
    </>
  );
}
