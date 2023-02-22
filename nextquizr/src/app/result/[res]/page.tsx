import { aesGcmDecrypt } from "@/crypto";
import { useRouter } from "next/router";
import styles from "./page.module.css";

type Props = {
  res: string;
}

type Evaluation = {
  correctAnswers: number;
  city: string;
  correctPercentage: number;
}

export default async function Result({ params }: { params: Props }) {
  const evaluation: Evaluation = JSON.parse(await aesGcmDecrypt(params.res, process.env.ENCRYPTION_KEY!));
  return(
    <>
      <div className="centered">
        <h2>You did the { evaluation.city } quiz:</h2>
        <p className="answer">
          You answered { evaluation.correctAnswers } questions correctly.
          That is { evaluation.correctPercentage }%!
        </p>
      </div>
    </>
  )
}
