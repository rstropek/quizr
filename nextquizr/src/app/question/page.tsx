type Props = {
    city: string;
    questionUrl: string;
}

type Quiz = {
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

export default async function Question(data: Props) {
  console.log(data);
  const qResponse = await fetch(data.questionUrl);
    const question: Quiz = (await qResponse.json());

  return <>
    <ul>
      <li>{question.id}</li>
      <li>{question.city}</li>
      <li>{question.question}</li>
      <li>{question.answer1}</li>
      <li>{question.answer2}</li>
      <li>{question.answer3}</li>
      <li>{question.answer4}</li>
    </ul>
  </>;
}
