import { Quiz } from "@/types";
import Question from "../question/page";

export default async function Home(props: any) {
  // Note that the type of the parameter cities is any because of a bug in the
  // current preview version of Next.js. Read more at https://github.com/vercel/next.js/issues/45088.
  // Therefore, we need to cast the parameter to the correct type.
  const searchParams = props.searchParams;

  // We fetch the questions for the selectec city on the server.
  // The client should never see the backend API that we are using. In real world,
  // we might need e.g. a specific API key to access the backend API. That
  // key should never be exposed to the client.
  //
  const qResponse = await fetch(
    `${process.env.SERVICE_BASE_URL!}/quizzes/cities/${searchParams.city}`
  );
  const questions: Quiz[] = await qResponse.json();

  // In our demo use case, it is important that the client does not see the
  // result of the backend API as it contains the correct answers to the
  // questions.
  questions.forEach((question) => question.correctAnswer = "");

  // Randomize the order of the questions.
  questions.sort(() => Math.random() - 0.5);

  return (
    <>
      <Question questions={questions}></Question>
    </>
  );
}
