import { aesGcmEncrypt } from "@/crypto";
import type { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export type Answers = {
  city: string;
  answers: {
    questionId: string;
    answer: string;
  }[];
};

type Quiz = {
  id?: string;
  correctAnswer: string;
};

type Evaluation = {
    correctAnswers: number;
    city: string;
    correctPercentage: number;
};

export default async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const answers: Answers = await req.json();
  if (answers === undefined || !answers.city || !Array.isArray(answers.answers)) {
    return new Response("Invalid request", { status: 400 });
  }

  // Check if answers contains duplicate IDs
  const ids = answers.answers.map((a) => a.questionId);
  if (ids.length !== new Set(ids).size) {
    return new Response("Invalid request", { status: 400 });
  }

  const qResponse = await fetch(
    `https://cfquizr.rstropek.com/quizzes/cities/${answers.city}`
  );
  const quizzes: Quiz[] = await qResponse.json();

  // count correct answers in answers.answers by comparing it with quizzes
  const correctAnswers = answers.answers.filter((answer) => {
    const quiz = quizzes.find((q) => {
      console.log(q.id, answer.questionId)
      return q.id === answer.questionId
    });
    console.log(quizzes, answer);
    return quiz && quiz.correctAnswer === answer.answer;
  }).length;

  const evaluation: Evaluation = {
    correctAnswers,
    city: answers.city,
    correctPercentage: Math.round((correctAnswers / quizzes.length) * 10000) / 100,
  };

  return new Response(JSON.stringify(await aesGcmEncrypt(JSON.stringify(evaluation), process.env.ENCRYPTION_KEY!)));
}
