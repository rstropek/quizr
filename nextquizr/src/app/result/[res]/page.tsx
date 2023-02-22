import { aesGcmDecrypt } from "@/crypto";
import { useRouter } from "next/router";

type Props = {
  res: string;
}

export default async function Result({ params }: { params: Props }) {
  const decryptedResult = await aesGcmDecrypt(params.res, process.env.ENCRYPTION_KEY!);
  return(
    <>
      <div>{ decryptedResult }</div>
    </>
  )
}
