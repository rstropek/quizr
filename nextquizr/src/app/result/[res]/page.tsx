import { aesGcmDecrypt } from "@/crypto";
import { Evaluation } from "@/types";
import Link from "next/link";
import styles from "./page.module.css"

type Props = {
  res: string;
};

export default async function Result({ params }: { params: Props }) {
  const evaluation: Evaluation = JSON.parse(
    await aesGcmDecrypt(params.res, process.env.ENCRYPTION_KEY!)
  );
  return (
    <>
      <h2>You did the {evaluation.city} quiz:</h2>
      <p className="answer">
        You answered {evaluation.correctAnswers} questions correctly. That is{" "}
        {evaluation.correctPercentage}%!
      </p>

      <Link href="/" className={styles.backToStart}>Let me take another quiz&nbsp;...</Link>
    </>
  );
}
