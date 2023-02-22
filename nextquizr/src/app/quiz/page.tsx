import Question from "../question/page";

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

export default async function Home({searchParams}: { searchParams: { city: string }}) {
  const qResponse = await fetch(
    `https://cfquizr.rstropek.com/quizzes/cities/${searchParams.city}`
    );
    const questions: Quiz[] = (await qResponse.json());
    return (
      <>
        <h1>{searchParams.city}</h1>
        <Question questions={questions}></Question>
      </>
  );
}
