import { aesGcmEncrypt } from "@/crypto";
import { Answers, Evaluation, Quiz } from "@/types";
import type { NextRequest } from "next/server";

// This is a server-side API that uses the edge runtime.
export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Check the request body
  const answers: Answers = await req.json();
  if (answers === undefined || !answers.city || !Array.isArray(answers.answers)) {
    return new Response("Invalid request", { status: 400 });
  }

  // Check if answers contains duplicate IDs
  const ids = answers.answers.map((a) => a.questionId);
  if (ids.length !== new Set(ids).size) {
    return new Response("Invalid request", { status: 400 });
  }

  // Fetch questions with correct answers
  const qResponse = await fetch(
    `${process.env.SERVICE_BASE_URL!}/quizzes/cities/${answers.city}`
  );
  const quizzes: Quiz[] = await qResponse.json();

  // Count correct answers in answers.answers by comparing it with quizzes
  const correctAnswers = answers.answers.filter((answer) => {
    const quiz = quizzes.find((q) => q.id === answer.questionId);
    return quiz && quiz.correctAnswer === answer.answer;
  }).length;

  // Build, encrypt, and return evaluation result
  const evaluation: Evaluation = {
    correctAnswers,
    city: answers.city,
    correctPercentage: Math.round((correctAnswers / quizzes.length) * 10000) / 100,
  };
  return new Response(JSON.stringify(await aesGcmEncrypt(JSON.stringify(evaluation), process.env.ENCRYPTION_KEY!)));
}
