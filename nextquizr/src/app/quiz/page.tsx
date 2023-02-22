import Question from "../question/page";

type QuizReference = {
  id: string;
  url: string;
}

export default async function Home({searchParams}: { searchParams: { city: string }}) {
  const qResponse = await fetch(
    `https://cfquizr.rstropek.com/quizzes/cities/${searchParams.city}/questions`
    );
    const questions: QuizReference[] = (await qResponse.json());
    return (
      <>
        <h1>{searchParams.city}</h1>
        {/* @ts-expect-error Server Component */}
        <Question city={searchParams.city} questionUrl={questions[0].url}></Question>
      </>
  );
}
